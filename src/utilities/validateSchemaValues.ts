import { validateSchema } from '..'
import EntityFactory from '../factories/EntityFactory'
import {
	ISchema,
	ISchemaValidateOptions,
	SchemaPartialValues,
	SchemaValues,
} from '../schemas.static.types'
import { DeepReadonly } from '../types/utilities.types'

export default function validateSchemaValues<
	S extends ISchema,
	V extends SchemaPartialValues<S> | DeepReadonly<SchemaPartialValues<S>>
>(
	schema: S,
	values: V,
	options?: ISchemaValidateOptions<S>
	// eslint-disable-next-line no-undef
): asserts values is V & SchemaValues<S> {
	validateSchema(schema)

	const instance = EntityFactory.Entity(schema, values as any)

	instance.validate(options)
}
