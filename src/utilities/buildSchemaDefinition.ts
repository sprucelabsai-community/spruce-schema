import { ISchemaDefinition } from '../Schema'
// Import { FieldDefinition } from '#spruce:schema/fields/fields.types'
// TODO figure out how to get field mixing to type properly with SchemaDefinitionValues

/** Build a schema type for use in your skill */
export default function buildSchemaDefinition<T extends ISchemaDefinition>(
	definition: T
): T {
	return definition
}

// Export default function buildSchemaDefinition<
// 	T extends ISchemaDefinition,
// 	F extends { [name: string]: FieldDefinition }
// >(definition: T, mixinFields?: F): T & { fields: F } {
// 	const copied = { ...definition }
// 	if (mixinFields) {
// 		if (!copied.fields) {
// 			copied.fields = {}
// 		}
// 		copied.fields = {
// 			...copied.fields,
// 			...mixinFields
// 		}
// 	}
// 	return copied as T & { fields: F }
// }
