import { ISchemaDefinition } from '../Schema'
// Import { FieldDefinition } from '#spruce:schema/fields/fields.types'
// TODO figure out how to get field mixing to type properly with SchemaDefinitionValues

type Narrowable =
	| string
	| number
	| boolean
	| symbol
	| object
	| null
	| undefined
	| void
	| ((...args: any[]) => any)
	| {}

//TODO figure out how to stop widening in the schema so types are saved
/** Build select options so they can generate a union based on values */
export default function buildSchemaDefinition<
	S extends ISchemaDefinition,
	T extends { [K in keyof S]: V | T },
	V extends Narrowable
>(t: T): T {
	return t
}

/** Build a schema type for use in your skill */
// export default function buildSchemaDefinition<T extends ISchemaDefinition>(
// 	definition: T
// ) {
// 	return narrow(definition)
// }

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
