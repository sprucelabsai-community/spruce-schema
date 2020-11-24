import { Schema, SchemaIdWithVersion } from '../schemas.static.types'

export default function isIdWithVersion(item: SchemaIdWithVersion | Schema) {
	return (
		typeof item.id === 'string' &&
		typeof (item as any).fields === 'undefined' &&
		typeof (item as any).dynamicFieldSignature === 'undefined'
	)
}
