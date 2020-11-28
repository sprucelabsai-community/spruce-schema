import {
	SchemaDefaultValues,
	Schema,
	SchemaGetDefaultValuesOptions,
	SchemaFieldNamesWithDefaultValue,
} from '../schemas.static.types'
import StaticSchemaEntityImplementation from '../StaticSchemaEntityImplementation'

export default function defaultSchemaValues<
	S extends Schema,
	F extends SchemaFieldNamesWithDefaultValue<S> = SchemaFieldNamesWithDefaultValue<S>,
	CreateEntityInstances extends boolean = true
>(
	definition: S,
	options: SchemaGetDefaultValuesOptions<S, F, CreateEntityInstances> = {}
): SchemaDefaultValues<S> {
	const instance = new StaticSchemaEntityImplementation(definition)

	// @ts-ignore
	return instance.getDefaultValues({
		createEntityInstances: false,
		...options,
	})
}
