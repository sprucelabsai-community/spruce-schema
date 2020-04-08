import { ISchemaDefinition } from '../Schema'

/** Build error definition */
export default function buildErrorDefinition<T extends ISchemaDefinition>(
	definition: T
): T {
	return definition
}
