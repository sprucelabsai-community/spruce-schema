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

/** Define a schema type from a value with no widening */
export default function buildSchemaDefinition<
	S extends ISchemaDefinition,
	T extends { [K in keyof S]: V | T },
	V extends Narrowable
>(t: T): T {
	return t
}

// TODO proposal, schema field inherence, second arg is fields mixed into schema and maintain narrow typing
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
