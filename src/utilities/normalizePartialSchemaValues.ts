import {
	Schema,
	SchemaPartialValues,
	SchemaGetValuesOptions,
	SchemaFieldNames,
	SchemaPublicFieldNames,
	SchemaValues,
} from '../schemas.static.types'
import normalizeSchemaValues from './normalizeSchemaValues'

export default function normalizePartialSchemaValues<
	S extends Schema,
	F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
	PF extends SchemaPublicFieldNames<S> = SchemaPublicFieldNames<S>,
	CreateEntityInstances extends boolean = false,
	IncludePrivateFields extends boolean = true,
	Values extends SchemaPartialValues<
		S,
		CreateEntityInstances
	> = SchemaPartialValues<S, CreateEntityInstances>,
	Fields extends keyof Values = keyof Values,
>(
	schema: S,
	values: Values,
	options?: SchemaGetValuesOptions<
		S,
		F,
		PF,
		CreateEntityInstances,
		IncludePrivateFields
	>
) {
	const normalized = normalizeSchemaValues(schema, values, {
		...options,
		shouldIncludeNullAndUndefinedFields: false,
	} as any)

	return normalized as unknown as Required<
		Pick<
			SchemaValues<S, CreateEntityInstances>,
			/** @ts-ignore */
			Fields
		>
	>
}
