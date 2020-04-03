import { ISchemaDefinition } from '..'
import { FieldType } from '../fields'
import { ISchemaDefinitionFields } from '../Schema'
import SchemaError from '../errors/SchemaError'
import { SchemaErrorCode } from '../errors/types'

export interface ISchemaInterfaceTypeNames {
	interfaceName: string
	typeName: string
}

export interface ISchemaTemplateItem {
	id: string
	definition: ISchemaDefinition
	typeName: string
	interfaceName: string
}

function capitalizeFirstLetter(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export default class TemplateUtility {
	/** Generate interface and type names based off schema name */
	public static generateNames(schemaName: string): ISchemaInterfaceTypeNames {
		return {
			interfaceName: `I${capitalizeFirstLetter(schemaName)}`,
			typeName: `${capitalizeFirstLetter(schemaName)}`
		}
	}

	/** A map of names keyed by interface name */
	public static generateTemplateItems(
		/** Array of schema definitions */
		definitions: ISchemaDefinition[],
		/** The items built recursively returned an the end */
		items: ISchemaTemplateItem[] = [],
		/** For tracking recursively to keep from infinite depth */
		definitionsById: { [id: string]: ISchemaDefinition } = {}
	): ISchemaTemplateItem[] {
		let newItems = [...items]

		// Keep track of all definitions
		definitions.forEach(def => {
			definitionsById[def.id] = def
		})

		definitions.forEach(definition => {
			const { typeName, interfaceName } = TemplateUtility.generateNames(
				definition.id
			)

			// We've already mapped this type
			const matchIdx = items.findIndex(item => item.definition === definition)

			if (matchIdx > -1) {
				if (definition !== items[matchIdx].definition) {
					throw new SchemaError({
						code: SchemaErrorCode.DuplicateSchemaId,
						schemaId: definition.id,
						additionalDetails: 'Found while generating template items'
					})
				}
				return
			}

			// Check children
			Object.values(definition.fields ?? {}).forEach(field => {
				if (field.type === FieldType.Schema) {
					// Find schema reference based on sub schema or looping through all definitions
					const schemaDefinition =
						field.options.schema ||
						definitionsById[field.options.schemaId || 'missing']

					if (!schemaDefinition) {
						throw new SchemaError({
							code: SchemaErrorCode.SchemaNotFound,
							schemaId:
								field.options.schemaId ||
								field.options.schema?.id ||
								'**MISSING ID**',
							additionalDetails: 'Error while resolving schema fields'
						})
					}
					newItems = TemplateUtility.generateTemplateItems(
						[schemaDefinition],
						newItems,
						definitionsById
					)
				}
			})

			// Was this already added?
			if (newItems.findIndex(item => item.id === definition.id) === -1) {
				newItems.push({
					id: definition.id,
					interfaceName,
					typeName,
					definition
				})
			}
		})

		// Now that everything is mapped, lets change schema fields to id's (vs sub schemas)
		newItems = newItems.map(templateItem => {
			const { definition } = templateItem

			let newFields: ISchemaDefinitionFields | undefined

			Object.keys(definition.fields ?? {}).forEach(name => {
				const field = definition.fields?.[name]

				// If this is a schema field, lets make sure schema id is set correctly
				if (
					field &&
					field.type === FieldType.Schema &&
					!field.options.schemaId
				) {
					if (!newFields) {
						newFields = {}
					}

					// Get the one true id
					const schemaId = field.options.schema
						? field.options.schema.id
						: field.options.schemaId

					// Build new options
					const newOptions = { ...field.options }

					// No schema or schema id options (set again below)
					delete newOptions.schema

					// Setup new field
					newFields[name] = {
						...field,
						options: {
							...newOptions,
							schemaId
						}
					}
				}
			})

			if (newFields) {
				const updatedItem = {
					...templateItem,
					definition: {
						...templateItem.definition,
						fields: {
							...templateItem.definition.fields,
							...newFields
						}
					}
				}
				return updatedItem
			}

			return templateItem
		})

		return newItems
	}
}
