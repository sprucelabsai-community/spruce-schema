import DynamicSchemaEntityImplementation from '../DynamicSchemaEntityImplementation'
import {
	DynamicSchemaPartialValues,
	Schema,
	IsDynamicSchema,
	SchemaPartialValues,
} from '../schemas.static.types'
import StaticSchemaEntity from '../StaticSchemaEntityImplementation'

export default class SchemaEntityFactory {
	public static Entity<
		S extends Schema,
		IsDynamic extends boolean = IsDynamicSchema<S>
	>(
		schema: S,
		values?: SchemaPartialValues<S>
	): IsDynamic extends true
		? DynamicSchemaEntityImplementation<S>
		: StaticSchemaEntity<S> {
		const instance = schema.dynamicFieldSignature
			? new DynamicSchemaEntityImplementation(
					schema,
					values as DynamicSchemaPartialValues<S>
			  )
			: new StaticSchemaEntity(schema, values)

		return instance as IsDynamic extends true
			? DynamicSchemaEntityImplementation<S>
			: StaticSchemaEntity<S>
	}
}
