import {
	SchemaDefaultValues,
	ISchema,
	ISchemaGetDefaultValuesOptions,
	SchemaFieldNamesWithDefaultValue,
} from '../schemas.static.types'
import StaticSchemaEntityImplementation from '../StaticSchemaEntityImplementation'

export default function defaultSchemaValues<
	S extends ISchema,
	F extends SchemaFieldNamesWithDefaultValue<
		S
	> = SchemaFieldNamesWithDefaultValue<S>,
	CreateEntityInstances extends boolean = true
>(
	definition: S,
	options: ISchemaGetDefaultValuesOptions<S, F, CreateEntityInstances> = {}
): SchemaDefaultValues<S> {
	const instance = new StaticSchemaEntityImplementation(definition)

	// @ts-ignore
	return instance.getDefaultValues({
		createEntityInstances: false,
		...options,
	})
}
