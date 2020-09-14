import { ISchema } from '../schemas.static.types'
import SchemaRegistry from '../singletons/SchemaRegistry'

/** Builds a schema definition */
export default function buildSchema<T extends ISchema>(schema: T): T {
	SchemaRegistry.getInstance().trackSchema(schema)
	return schema
}
