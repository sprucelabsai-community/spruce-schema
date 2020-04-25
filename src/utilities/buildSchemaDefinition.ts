import Schema from '../Schema'
import { ISchemaDefinition } from '../schema.types'

/** Builds a schema definition */
export default function buildSchemaDefinition<T extends ISchemaDefinition>(
	definition: T
): T {
	Schema.validateDefinition(definition)
	return definition
}
