import SchemaEntity from '../SchemaEntity'
import { ISchema } from '../schemas.static.types'

/** Builds a schema definition */
export default function buildSchema<T extends ISchema>(
	schema: T
): T & { builder: 'buildSchema' } {
	const built = { ...schema, builder: 'buildSchema' }
	SchemaEntity.trackSchema(built)
	return built as T & { builder: 'buildSchema' }
}
