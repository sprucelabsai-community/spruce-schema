import SchemaEntity from '../SchemaEntity'
import {
	ISchema,
	SchemaPartialValues,
	ISchemaGetValuesOptions,
	SchemaFieldNames,
	SchemaPublicFieldNames,
} from '../schemas.static.types'

export default function normalizeSchemaValues<
	S extends ISchema,
	F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
	PF extends SchemaPublicFieldNames<S> = SchemaPublicFieldNames<S>,
	CreateEntityInstances extends boolean = true,
	IncludePrivateFields extends boolean = true
>(
	definition: S,
	values: SchemaPartialValues<S>,
	options?: ISchemaGetValuesOptions<
		S,
		F,
		PF,
		CreateEntityInstances,
		IncludePrivateFields
	>
) {
	const instance = new SchemaEntity(definition, values)

	return instance.getValues(options)
}
