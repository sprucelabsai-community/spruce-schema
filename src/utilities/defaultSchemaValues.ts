import Schema from '../Schema'
import {
	SchemaDefinitionDefaultValues,
	ISchemaDefinition,
	ISchemaGetDefaultValuesOptions,
	FieldNamesWithDefaultValueSet,
} from '../schemas.static.types'

export default function defaultSchemaValues<
	S extends ISchemaDefinition,
	F extends FieldNamesWithDefaultValueSet<S> = FieldNamesWithDefaultValueSet<S>,
	CreateSchemaInstances extends boolean = true
>(
	definition: S,
	options: ISchemaGetDefaultValuesOptions<S, F, CreateSchemaInstances> = {}
): SchemaDefinitionDefaultValues<S> {
	const instance = new Schema(definition)

	// @ts-ignore
	return instance.getDefaultValues({
		createSchemaInstances: false,
		...options,
	})
}
