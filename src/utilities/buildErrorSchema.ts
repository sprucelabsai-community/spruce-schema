import { ISchema } from '../schemas.static.types'

/** Build error schema */
export default function buildErrorSchema<T extends ISchema>(
	schema: T
): T & { builder: 'buildErrorSchema' } {
	return { ...schema, builder: 'buildErrorSchema' }
}
