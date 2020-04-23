import { FieldDefinition } from '#spruce:schema/fields/fields.types'
import Schema from '..'

/** Build a field type for use in your skill */
export default function buildFieldDefinition<T extends FieldDefinition>(
	definition: T
): T {
	Schema.validateDefinition(definition)
	return definition
}
