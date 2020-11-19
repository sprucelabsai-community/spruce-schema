import EntityFactory from '../factories/EntityFactory'
import {
	ISchema,
	ISchemaValidateOptions,
	SchemaPartialValues,
} from '../schemas.static.types'

export default function areSchemaValuesValid<S extends ISchema>(
	definition: S,
	values: SchemaPartialValues<S>,
	options?: ISchemaValidateOptions<S>
) {
	const instance = EntityFactory.Entity(definition, values)
	return instance.isValid(options)
}
