import EntityFactory from '../factories/SchemaEntityFactory'
import {
	Schema,
	SchemaPartialValues,
	SchemaGetValuesOptions,
	SchemaFieldNames,
	SchemaPublicFieldNames,
	IsDynamicSchema,
	DynamicSchemaAllValues,
	SchemaPublicValues,
	SchemaAllValues,
	SchemaEntity,
} from '../schemas.static.types'

export default function normalizeSchemaValues<
	S extends Schema,
	F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
	PF extends SchemaPublicFieldNames<S> = SchemaPublicFieldNames<S>,
	CreateEntityInstances extends boolean = false,
	IncludePrivateFields extends boolean = true,
	IsDynamic extends boolean = IsDynamicSchema<S>
>(
	schema: S,
	values: SchemaPartialValues<S>,
	options?: SchemaGetValuesOptions<
		S,
		F,
		PF,
		CreateEntityInstances,
		IncludePrivateFields
	>
) {
	const instance = EntityFactory.Entity<S, IsDynamic>(schema, values)

	const { shouldCreateEntityInstances = false, ...rest } = options || {}

	const normalizedOptions = {
		shouldCreateEntityInstances,
		...rest,
	} as SchemaGetValuesOptions<
		S,
		F,
		PF,
		CreateEntityInstances,
		IncludePrivateFields
	>

	return (instance as SchemaEntity).getValues(
		normalizedOptions
	) as IsDynamic extends true
		? DynamicSchemaAllValues<S, CreateEntityInstances>
		: IncludePrivateFields extends false
		? Pick<SchemaPublicValues<S, CreateEntityInstances>, PF>
		: Pick<SchemaAllValues<S, CreateEntityInstances>, F>
}
