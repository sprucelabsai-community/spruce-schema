import SchemaEntity from '../SchemaEntity'
import {
	ISchema,
	ISchemaGetValuesOptions,
	SchemaStaticFieldNames,
	SchemaPublicFieldNames,
	SchemaPartialValues,
} from '../schemas.static.types'

export default function normalizeSchemaValues<
	S extends ISchema,
	F extends SchemaStaticFieldNames<S>,
	PF extends SchemaPublicFieldNames<S>,
	CreateEntityInstances extends boolean,
	IncludePrivateFields extends boolean
>(
	schema: S,
	values: SchemaPartialValues<S>,
	options?: ISchemaGetValuesOptions<
		S,
		F,
		PF,
		CreateEntityInstances,
		IncludePrivateFields
	>
) {
	const instance = new SchemaEntity(schema, values)
	return instance.getValues(options)
}
