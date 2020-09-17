import { ISchema } from '../schemas.static.types'
import SchemaRegistry from '../singletons/SchemaRegistry'

export default function buildSchema<T extends ISchema>(schema: T): T {
	SchemaRegistry.getInstance().trackSchema(schema)
	return schema
}
