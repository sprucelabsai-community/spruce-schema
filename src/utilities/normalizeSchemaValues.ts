import SchemaEntity from '../SchemaEntity'
import {
	ISchema,
	ISchemaGetValuesOptions,
	SchemaFieldNames,
	SchemaPublicFieldNames,
	SchemaDynamicOrStaticPartialValues,
} from '../schemas.static.types'

export default function normalizeSchemaValues<
	S extends ISchema,
	F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
	PF extends SchemaPublicFieldNames<S> = SchemaPublicFieldNames<S>,
	CreateEntityInstances extends boolean = true,
	IncludePrivateFields extends boolean = true
>(
	schema: S,
	values: SchemaDynamicOrStaticPartialValues<S>,
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
