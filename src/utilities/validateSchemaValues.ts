import SchemaEntity from '../SchemaEntity'
import {
	ISchema,
	ISchemaValidateOptions,
	SchemaPartialValues,
} from '../schemas.static.types'

export default function validateSchemaValues<S extends ISchema>(
	schema: S,
	values: SchemaPartialValues<S>,
	options?: ISchemaValidateOptions<S>
) {
	const instance = new SchemaEntity(schema, values)
	instance.validate(options)
}
