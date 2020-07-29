import SchemaEntity from '../SchemaEntity'
import { ISchema } from '../schemas.static.types'

/** Builds a schema definition */
export default function buildSchema<T extends ISchema>(definition: T): T {
	SchemaEntity.trackSchema(definition)
	return definition
}
