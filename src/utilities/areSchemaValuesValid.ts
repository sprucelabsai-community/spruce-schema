import EntityFactory from '../factories/SchemaEntityFactory'
import {
	Schema,
	SchemaValidateOptions,
	SchemaPartialValues,
} from '../schemas.static.types'

export default function areSchemaValuesValid<S extends Schema>(
	definition: S,
	values: SchemaPartialValues<S>,
	options?: SchemaValidateOptions<S>
) {
	const instance = EntityFactory.Entity(definition, values)
	return instance.isValid(options)
}
