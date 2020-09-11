import SchemaEntity from '../SchemaEntity'
import {
	ISchema,
	ISchemaValidateOptions,
	SchemaDynamicOrStaticPartialValues,
} from '../schemas.static.types'

export default function areSchemaValuesValid<S extends ISchema>(
	definition: S,
	values: SchemaDynamicOrStaticPartialValues<S>,
	options?: ISchemaValidateOptions<S>
) {
	const instance = new SchemaEntity(definition, values)
	return instance.isValid(options)
}
