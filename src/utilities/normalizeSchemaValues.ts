import SchemaEntity from '../SchemaEntity'
import {
	ISchema,
	SchemaPartialValues,
	ISchemaGetValuesOptions,
	SchemaFieldNames,
} from '../schemas.static.types'

export default function normalizeSchemaValues<
	S extends ISchema,
	F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
	CreateEntityInstances extends boolean = true
>(
	definition: S,
	values: SchemaPartialValues<S>,
	options?: ISchemaGetValuesOptions<S, F, CreateEntityInstances>
) {
	const instance = new SchemaEntity(definition, values)

	return instance.getValues({
		...(options ?? {}),
	})
}
