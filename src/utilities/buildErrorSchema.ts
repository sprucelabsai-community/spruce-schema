import SchemaEntity from '..'
import { ISchema } from '../schemas.static.types'

/** Build error schema */
export default function buildErrorSchema<T extends ISchema>(schema: T): T {
	SchemaEntity.validateSchema(schema)
	return schema
}
