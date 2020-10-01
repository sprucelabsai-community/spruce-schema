import SpruceError from '../errors/SpruceError'
import { ISchema } from '../schemas.static.types'

export default function validateSchema(schema: any): asserts schema is ISchema {
	const errors: string[] = []

	if (!schema) {
		errors.push('definition_empty')
	} else {
		if (!schema.id) {
			errors.push('id_missing')
		} else if (!(typeof schema.id === 'string')) {
			errors.push('id_not_string')
		}

		if (schema.name && !(typeof schema.name === 'string')) {
			errors.push('name_not_string')
		}

		if (!schema.fields && !schema.dynamicFieldSignature) {
			errors.push('needs_fields_or_dynamic_field_signature')
		}
	}

	if (errors.length > 0) {
		throw new SpruceError({
			code: 'INVALID_SCHEMA',
			schemaId: schema?.id ?? 'ID MISSING',
			errors,
		})
	}
}
