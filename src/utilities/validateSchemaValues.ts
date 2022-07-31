import set from 'just-safe-set'
import { validateSchema } from '..'
import EntityFactory from '../factories/SchemaEntityFactory'
import {
	Schema,
	SchemaValidateOptions,
	SchemaPartialValues,
	SchemaValues,
} from '../schemas.static.types'

export default function validateSchemaValues<
	S extends Schema,
	V extends SchemaPartialValues<S>
>(
	schema: S,
	values: V,
	options?: SchemaValidateOptions<S>
	// eslint-disable-next-line no-undef
): asserts values is V & SchemaValues<S> {
	const { ...opts } = options ?? {}
	validateSchema(schema)

	const mapped = Object.keys(values).reduce((mapped, key) => {
		//@ts-ignore
		set(mapped, key, values[key])
		return mapped
	}, {})

	const instance = EntityFactory.Entity(schema, mapped as any)
	instance.validate(opts)
}
