import DynamicSchemaEntity from '../DynamicSchemaEntity'
import StaticSchemaEntity from '../SchemaEntity'
import {
	DynamicSchemaPartialValues,
	ISchema,
	IsDynamicSchema,
	SchemaPartialValues,
} from '../schemas.static.types'

export default class EntityFactory {
	public static Entity<
		S extends ISchema,
		IsDynamic extends boolean = IsDynamicSchema<S>
	>(
		schema: S,
		values?: SchemaPartialValues<S>
	): IsDynamic extends true ? DynamicSchemaEntity<S> : StaticSchemaEntity<S> {
		const instance = schema.dynamicFieldSignature
			? new DynamicSchemaEntity(schema, values as DynamicSchemaPartialValues<S>)
			: new StaticSchemaEntity(schema, values)

		return instance as IsDynamic extends true
			? DynamicSchemaEntity<S>
			: StaticSchemaEntity<S>
	}
}
