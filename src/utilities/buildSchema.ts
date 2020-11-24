import { Schema } from '../schemas.static.types'
import SchemaRegistry from '../singletons/SchemaRegistry'

export default function buildSchema<T extends Schema>(schema: T): T {
	SchemaRegistry.getInstance().trackSchema(schema)
	return schema
}
