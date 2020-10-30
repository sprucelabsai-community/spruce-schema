import { validateSchema } from '..'
import SchemaEntity from '../SchemaEntity'
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

	const instance = new SchemaEntity(schema, values as any)

	instance.validate(options)
}
