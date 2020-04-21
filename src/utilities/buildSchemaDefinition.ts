import { ISchemaDefinition } from '../Schema'

/** Builds a schema definition */
export default function buildSchemaDefinition<T extends ISchemaDefinition>(
	definition: T
): T {
	return definition
}
