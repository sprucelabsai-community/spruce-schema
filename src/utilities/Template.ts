import { ISchemaDefinition } from '..'
import { FieldType } from '../fields'
import { ISchemaFieldsDefinition } from '../Schema'

export interface ISchemaInterfaceTypeNames {
	interfaceName: string
	typeName: string
}

export interface ISchemaTemplateItem {
	id: string,
	definition: ISchemaDefinition
	typeName: string
	interfaceName: string
}

function capitalizeFirstLetter(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export default class Template {
	/** generate interface and type names based off schema name */
	public static generateNames(schemaName: string): ISchemaInterfaceTypeNames {
		return {
			interfaceName: `I${capitalizeFirstLetter(schemaName)}`,
			typeName: `${capitalizeFirstLetter(schemaName)}`
		}
	}


	/** a map of names keyed by interface name */
	public static generateTemplateItems(
		definitions: ISchemaDefinition[],
		items: ISchemaTemplateItem[] = []
	): ISchemaTemplateItem[] {
		let newItems = [ ...items ]

		definitions.forEach(definition => {
			const { typeName, interfaceName } = Template.generateNames(definition.id)

			debugger
			// we've already mapped this type
			const matchIdx = items.findIndex(item => item.definition === definition) 
			if (matchIdx > -1) {
				if (definition !== items[matchIdx].definition) {
					throw new Error(`Schema with id ${definition.id} already exists!`)
				}
				return
			}


			// check children
			Object.values(definition.fields ?? {}).forEach(field => {
				if (field.type === FieldType.Schema) {
					const schemaDefinition = field.options.schema
					if (schemaDefinition) {
						newItems = Template.generateTemplateItems([schemaDefinition], newItems)
					}
				}
			})

			newItems.push({
				id: definition.id,
				interfaceName,typeName,definition
			})

		})

		// now that everything is mapped, lets change schema fields to id's (vs sub schemas)
		newItems = newItems.map(
			(map, idx) => {
				const { definition } = map

				let newFields: ISchemaFieldsDefinition | undefined

				Object.keys(definition.fields ?? {}).forEach(name => {
					const field = definition.fields?.[name]

					// if this is a schema field, lets make sure schema id is set correctly
					if (field && field.type === FieldType.Schema) {
						if (!newFields) {
							newFields = {}
						}

						// get the one true id
						const schemaId = field.options.schema
							? field.options.schema.id
							: field.options.schemaId

						// build new options
						const newOptions = { ...field.options }

						// no schema or schema id options (set again below)
						delete newOptions.schema

						// setup new field
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
					debugger
					const updatedMap = { 
						...map,
						definition: {
							...map.definition,
							fields: {
								...map.definition.fields,
								...newFields
							}
						}
					}
					return updatedMap
				}

				return map
			}
			
		)


		return newItems
	}
}
