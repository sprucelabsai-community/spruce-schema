import { Schema, SchemaFieldNames } from '..'
import SpruceError from '../errors/SpruceError'

export default function getFields<S extends Schema>(
	schema: S
): SchemaFieldNames<S>[] {
	const names = Object.keys(schema?.fields ?? {})

	if (names.length === 0) {
		throw new SpruceError({
			code: 'INVALID_PARAMETERS',
			parameters: ['schema'],
		})
	}

	return names as any
}
