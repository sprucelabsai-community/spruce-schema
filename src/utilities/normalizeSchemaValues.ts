import Schema from '../Schema'
import {
	ISchemaDefinition,
	SchemaDefinitionPartialValues,
	ISchemaGetValuesOptions,
	SchemaFieldNames,
} from '../schemas.static.types'

export default function normalizeSchemaValues<
	S extends ISchemaDefinition,
	F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
	CreateSchemaInstances extends boolean = true
>(
	definition: S,
	options?: ISchemaGetValuesOptions<S, F, CreateSchemaInstances>
): SchemaDefinitionPartialValues<S, CreateSchemaInstances> {
	const instance = new Schema(definition)

	return instance.getValues({
		...(options ?? {}),
	}) as SchemaDefinitionPartialValues<S, CreateSchemaInstances>
}
