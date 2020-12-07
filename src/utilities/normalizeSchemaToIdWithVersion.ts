import { Schema, SchemaIdWithVersion } from '../schemas.static.types'
import isIdWithVersion from './isIdWithVersion'

export default function normaizeSchemaToIdWithVersion(
	schemaOrIdWithVersion: Schema | SchemaIdWithVersion
) {
	if (isIdWithVersion(schemaOrIdWithVersion)) {
		return schemaOrIdWithVersion
	}

	const idWithVersion: SchemaIdWithVersion = { id: schemaOrIdWithVersion.id }

	if (schemaOrIdWithVersion.version) {
		idWithVersion.version = schemaOrIdWithVersion.version
	}

	if (schemaOrIdWithVersion.namespace) {
		idWithVersion.namespace = schemaOrIdWithVersion.namespace
	}

	return idWithVersion
}
