import SpruceError from '../errors/SpruceError'
import SchemaEntity from '../SchemaEntity'
import {
	ISchema,
	ISchemaValidateOptions,
	SchemaDynamicOrStaticPartialValues,
	SchemaValues,
} from '../schemas.static.types'

export default function validateSchemaValues<
	S extends ISchema,
	V extends SchemaDynamicOrStaticPartialValues<S>
>(
	schema: S,
	values: V,
	options?: ISchemaValidateOptions<S>
	// eslint-disable-next-line no-undef
): asserts values is V & SchemaValues<S> {
	SchemaEntity.validateSchema(schema)

	const extraFields: string[] = pluckExtraFields<S>(values, schema)

	if (extraFields.length > 0) {
		throw new SpruceError({
			code: 'FIELD_NOT_FOUND',
			schemaId: schema.id,
			fields: extraFields,
		})
	}

	const instance = new SchemaEntity(schema, values)

	instance.validate(options)
}

function pluckExtraFields<
	S extends ISchema,
	V extends SchemaDynamicOrStaticPartialValues<
		S
	> = SchemaDynamicOrStaticPartialValues<S>
>(values: V, schema: S) {
	const extraFields: string[] = []
	if (schema.fields) {
		const passedFields = Object.keys(values)
		const expectedFields = Object.keys(schema.fields)

		passedFields.forEach((passed) => {
			if (expectedFields.indexOf(passed) === -1) {
				extraFields.push(passed)
			}
		})
	}
	return extraFields
}
