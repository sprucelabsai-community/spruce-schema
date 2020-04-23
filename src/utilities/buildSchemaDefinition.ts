import { ISchemaDefinition } from '../Schema'
import Schema from '../Schema'

/** Builds a schema definition */
export default function buildSchemaDefinition<T extends ISchemaDefinition>(
	definition: T
): T {
	Schema.validateDefinition(definition)
	return definition
}
