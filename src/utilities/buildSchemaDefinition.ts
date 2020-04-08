import { ISchemaDefinition } from '../Schema'

/** Build a schema type for use in your skill */
export default function buildSchemaDefinition<T extends ISchemaDefinition>(
	definition: T
): T {
	return definition
}
