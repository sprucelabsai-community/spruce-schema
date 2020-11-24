import { ISchema, SchemaIdWithVersion } from '../schemas.static.types'

export default function isIdWithVersion(item: SchemaIdWithVersion | ISchema) {
	return (
		typeof item.id === 'string' &&
		typeof (item as any).fields === 'undefined' &&
		typeof (item as any).dynamicFieldSignature === 'undefined'
	)
}
