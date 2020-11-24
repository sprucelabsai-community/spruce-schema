import EntityFactory from '../factories/EntityFactory'
import {
	ISchema,
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
	S extends ISchema,
	F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
	PF extends SchemaPublicFieldNames<S> = SchemaPublicFieldNames<S>,
	CreateEntityInstances extends boolean = false,
	IncludePrivateFields extends boolean = true,
	IsDynamic extends boolean = IsDynamicSchema<S>
>(
	definition: S,
	values: SchemaPartialValues<S>,
	options?: SchemaGetValuesOptions<
		S,
		F,
		PF,
		CreateEntityInstances,
		IncludePrivateFields
	>
) {
	const instance = EntityFactory.Entity<S, IsDynamic>(definition, values)

	const { createEntityInstances = false, ...rest } = options || {}
	const normalizedOptions = {
		createEntityInstances,
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
