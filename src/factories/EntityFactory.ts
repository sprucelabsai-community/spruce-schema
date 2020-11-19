import DynamicSchemaEntity from '../DynamicSchemaEntity'
import StaticSchemaEntity from '../SchemaEntity'
import { ISchema } from '../schemas.static.types'

export default class EntityFactory {
	public static Entity(schema: ISchema, values: any) {
		return schema.dynamicFieldSignature
			? new DynamicSchemaEntity(schema, values)
			: new StaticSchemaEntity(schema, values)
	}
}
