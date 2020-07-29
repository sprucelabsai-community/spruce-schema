import SchemaEntity from '../SchemaEntity'
import {
	ISchema,
	ISchemaValidateOptions,
	SchemaPartialValues,
} from '../schemas.static.types'

export default function isSchemaValid<S extends ISchema>(
	definition: S,
	values: SchemaPartialValues<S>,
	options?: ISchemaValidateOptions<S>
) {
	const instance = new SchemaEntity(definition, values)
	return instance.isValid(options)
}
