import Schema from '../Schema'
import {
	SchemaDefinitionDefaultValues,
	ISchemaDefinition,
} from '../schemas.static.types'

export default function defaultSchemaValues<T extends ISchemaDefinition>(
	definition: T
): SchemaDefinitionDefaultValues<T> {
	const instance = new Schema(definition)

	// @ts-ignore
	return instance.getDefaultValues({
		createSchemaInstances: false,
	})
}
