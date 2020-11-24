import DynamicSchemaEntityImplementation from '../DynamicSchemaEntityImplementation'
import {
	DynamicSchemaPartialValues,
	ISchema,
	IsDynamicSchema,
	SchemaPartialValues,
} from '../schemas.static.types'
import StaticSchemaEntity from '../StaticSchemaEntityImplementation'

export default class EntityFactory {
	public static Entity<
		S extends ISchema,
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
