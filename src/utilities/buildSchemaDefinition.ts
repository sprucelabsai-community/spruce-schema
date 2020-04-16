import { ISchemaDefinition, ISchemaDefinitionFields } from '../Schema'

/** Build a schema type for use in your skill */
export default function buildSchemaDefinition<
	T extends ISchemaDefinition,
	F extends ISchemaDefinitionFields
>(definition: T, mixinFields?: F): T & { fields: F } {
	const copied = { ...definition }
	if (mixinFields) {
		if (!copied.fields) {
			copied.fields = {}
		}
		copied.fields = {
			...copied.fields,
			...mixinFields
		}
	}
	return copied as T & { fields: F }
}
