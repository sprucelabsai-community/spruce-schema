import { test, assert } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import buildSchema from '../../utilities/buildSchema'
import normalizeSchemaValues from '../../utilities/normalizeSchemaValues'

export default class NormalizingSchemaValues extends AbstractSchemaTest {
	private static personSchema = buildSchema({
		id: 'testPerson',
		name: 'A test person',
		fields: {
			firstName: {
				type: 'text',
				isRequired: true,
			},
			age: {
				type: 'number',
			},
			nestedArraySchema: {
				type: 'schema',
				isArray: true,
				options: {
					schema: {
						id: 'nested-schema',
						name: 'Nested',
						fields: {
							field1: {
								type: 'text',
							},
						},
					},
				},
			},
		},
	})

	@test()
	protected static normalizesSimpleAsExpected() {
		const values = normalizeSchemaValues(
			this.personSchema,
			{
				// @ts-ignore
				firstName: 12345,
				// @ts-ignore
				age: '10',
				nestedArraySchema: [{ field1: 'first' }, { field1: 'second' }],
			},
			{ createEntityInstances: false }
		)

		assert.isEqualDeep(values, {
			firstName: '12345',
			age: 10,
			nestedArraySchema: [{ field1: 'first' }, { field1: 'second' }],
		})
	}

	@test()
	protected static normalizeTypesAsExpected() {
		const values = normalizeSchemaValues(
			this.personSchema,
			{
				firstName: 'tay',
				age: 0,
				nestedArraySchema: [{ field1: 'first' }, { field1: 'second' }],
			},
			{ createEntityInstances: false }
		)

		assert.isExactType<
			typeof values,
			{
				firstName: string
				age: number | null | undefined
				nestedArraySchema:
					| { field1?: string | null | undefined }[]
					| null
					| undefined
			}
		>(true)
	}
}
