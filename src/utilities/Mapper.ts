import { ISchemaDefinition } from '..'
import { FieldType } from '../fields'
import { ISchemaFieldsDefinition } from '../Schema'

export interface ISchemaInterfaceTypeNames {
	interfaceName: string
	typeName: string
}

export interface ISchemaDefinitionMap {
	[id: string]: ISchemaDefinitionMapValue
}

export interface ISchemaDefinitionMapValue {
	definition: ISchemaDefinition
	typeName: string
	interfaceName: string
}

function capitalizeFirstLetter(string: string): string {
	return string.charAt(0).toUpperCase() + string.slice(1)
}

export default class Mapper {
	/** generate interface and type names based off schema name */
	public static generateNames(
		schemaName: string
	): ISchemaInterfaceTypeNames {
		return {
			interfaceName: `I${capitalizeFirstLetter(schemaName)}`,
			typeName: `${capitalizeFirstLetter(schemaName)}`
		}
	}

	/** a map of names keyed by interface name */
	public static generateSchemaMap(
		definitions: ISchemaDefinition[],
		map: ISchemaDefinitionMap = {}
	): ISchemaDefinitionMap {
		let newMap = { ...map }

		definitions.forEach(definition => {
			const { typeName, interfaceName } = Mapper.generateNames(
				definition.name
			)

			// we've already mapped this type
			if (definition.id in newMap) {
				if (definition !== newMap[definition.id].definition) {
					throw new Error(`Schema with id ${definition.id} already exists!`)
				}
				return
			}

			newMap[definition.id] = {
				interfaceName,
				typeName,
				definition
			}

			// check children
			Object.values(definition.fields ?? {}).forEach(field => {
				if (field.type === FieldType.Schema) {
					const schemaDefinition = field.options.schema
					if (schemaDefinition) {
						newMap = Mapper.generateSchemaMap([schemaDefinition], newMap)
					}
				}
			})
		})

		// now that everything is mapped, lets change schema fields to id's (vs sub schemas)
		newMap = Object.keys(newMap).reduce<ISchemaDefinitionMap>(
			(map, schemaId) => {
				const { definition } = map[schemaId]

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
					// copy back fields with schemaId's
					map[schemaId] = {
						...map[schemaId],
						definition: {
							...map[schemaId].definition,
							fields: {
								...map[schemaId].definition.fields,
								...newFields
							}
						}
					}
				}

				return map
			},
			newMap
		)

		return newMap
	}
}
