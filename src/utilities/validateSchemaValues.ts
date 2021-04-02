import { validateSchema } from '..'
import SpruceError from '../errors/SpruceError'
import EntityFactory from '../factories/SchemaEntityFactory'
import {
	Schema,
	SchemaValidateOptions,
	SchemaPartialValues,
	SchemaValues,
} from '../schemas.static.types'
import mapSchemaErrorsToParameterErrors from './mapSchemaErrorsToParameterErrors'

export default function validateSchemaValues<
	S extends Schema,
	V extends SchemaPartialValues<S>
>(
	schema: S,
	values: V,
	options?: SchemaValidateOptions<S>
	// eslint-disable-next-line no-undef
): asserts values is V & SchemaValues<S> {
	const { shouldMapToParameterErrors = true, ...opts } = options ?? {}
	validateSchema(schema)

	try {
		const instance = EntityFactory.Entity(schema, values as any)

		instance.validate(opts)
	} catch (err) {
		if (shouldMapToParameterErrors) {
			const errors = mapSchemaErrorsToParameterErrors(err) as any
			throw new SpruceError({
				code: 'VALIDATION_FAILED',
				errors,
			})
		} else {
			throw err
		}
	}
}
