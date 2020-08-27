import SchemaEntity from '../SchemaEntity'
import {
	SchemaDefaultValues,
	ISchema,
	ISchemaGetDefaultValuesOptions,
	SchemaFieldNamesWithDefaultValue,
} from '../schemas.static.types'

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
	const instance = new SchemaEntity(definition)

	// @ts-ignore
	return instance.getDefaultValues({
		createEntityInstances: false,
		...options,
	})
}
