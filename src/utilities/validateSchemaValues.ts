import { validateSchema } from '..'
import EntityFactory from '../factories/EntityFactory'
import {
	ISchema,
	SchemaValidateOptions,
	SchemaPartialValues,
	SchemaValues,
} from '../schemas.static.types'

export default function validateSchemaValues<
	S extends ISchema,
	V extends SchemaPartialValues<S>
>(
	schema: S,
	values: V,
	options?: SchemaValidateOptions<S>
	// eslint-disable-next-line no-undef
): asserts values is V & SchemaValues<S> {
	validateSchema(schema)

	const instance = EntityFactory.Entity(schema, values as any)

	instance.validate(options)
}
