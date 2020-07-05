import { ISchemaDefinition } from '../schemas.static.types'

/** Build error definition */
export default function buildErrorDefinition<T extends ISchemaDefinition>(
	definition: T
): T {
	return definition
}
