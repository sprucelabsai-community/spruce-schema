import EntityFactory from '../factories/SchemaEntityFactory'
import {
	Schema,
	SchemaPartialValues,
	SchemaGetValuesOptions,
	SchemaFieldNames,
	SchemaPublicFieldNames,
	IsDynamicSchema,
	DynamicSchemaAllValues,
	SchemaEntity,
	SchemaValues,
} from '../schemas.static.types'

export default function normalizeSchemaValues<
	S extends Schema,
	F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
	PF extends SchemaPublicFieldNames<S> = SchemaPublicFieldNames<S>,
	CreateEntityInstances extends boolean = false,
	IncludePrivateFields extends boolean = true,
	IsDynamic extends boolean = IsDynamicSchema<S>,
	ShouldIncludeNullAndUndefinedFields extends boolean = true,
>(
	schema: S,
	values: SchemaPartialValues<S>,
	options?: SchemaGetValuesOptions<
		S,
		F,
		PF,
		CreateEntityInstances,
		IncludePrivateFields,
		ShouldIncludeNullAndUndefinedFields
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
		IncludePrivateFields,
		ShouldIncludeNullAndUndefinedFields
	>

	return (instance as SchemaEntity).getValues(
		normalizedOptions
	) as IsDynamic extends true
		? DynamicSchemaAllValues<S, CreateEntityInstances>
		: IncludePrivateFields extends true
		  ? Pick<
					SchemaValues<
						S,
						CreateEntityInstances,
						true,
						ShouldIncludeNullAndUndefinedFields
					>,
					F
		    >
		  : Pick<
					SchemaValues<
						S,
						CreateEntityInstances,
						true,
						ShouldIncludeNullAndUndefinedFields
					>,
					PF
		    >
}
