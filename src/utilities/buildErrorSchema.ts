import { Schema } from '../schemas.static.types'

/** Build error schema */
export default function buildErrorSchema<T extends Schema>(schema: T): T {
	return schema
}
