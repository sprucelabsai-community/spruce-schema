import { test, assert } from '@sprucelabs/test'
import StaticSchemaEntityImplementation from '../..'
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
			boolean: {
				type: 'boolean',
			},
			privateBooleanField: {
				type: 'boolean',
				isPrivate: true,
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
			{ shouldCreateEntityInstances: false }
		)

		assert.isEqualDeep(values, {
			firstName: '12345',
			age: 10,
			boolean: undefined,
			privateBooleanField: undefined,
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
			{ shouldCreateEntityInstances: false }
		)

		assert.isExactType<
			typeof values,
			{
				firstName: string
				age: number | null | undefined
				boolean: boolean | null | undefined
				privateBooleanField: boolean | null | undefined
				nestedArraySchema:
					| { field1?: string | null | undefined }[]
					| null
					| undefined
			}
		>(true)
	}

	@test(
		'normalizes boolean with string false to false',
		{ boolean: 'false' },
		'boolean',
		false
	)
	@test(
		'normalizes boolean with string true to true',
		{ boolean: 'true' },
		'boolean',
		true
	)
	@test(
		'normalizes private boolean with string false to false',
		{ privateBooleanField: 'false' },
		'privateBooleanField',
		false
	)
	@test(
		'normalizes private boolean with string true to true',
		{ privateBooleanField: 'true' },
		'privateBooleanField',
		true
	)
	protected static normalizeAndCheckField(
		overrideValues: Record<string, any>,
		fieldName: string,
		expected: any
	) {
		const values = normalizeSchemaValues(this.personSchema, {
			firstName: 'tay',
			age: 0,
			nestedArraySchema: [{ field1: 'first' }, { field1: 'second' }],
			...overrideValues,
		})

		//@ts-ignore
		assert.isEqual(values[fieldName], expected)
	}

	@test()
	protected static honorsNotMakingSchemaEntitiesWithEntityValues() {
		const secondLevelSchema = buildSchema({
			id: 'nested-2nd-level-schema-entity',
			fields: {
				boolField: {
					type: 'boolean',
				},
			},
		})

		const schema = buildSchema({
			id: 'schema-entities',
			fields: {
				related: {
					type: 'schema',
					isArray: true,
					isRequired: true,
					options: {
						schema: {
							id: 'nested-schema-entities',
							fields: {
								textField: {
									type: 'text',
								},
								nested: {
									type: 'schema',
									options: {
										schema: secondLevelSchema,
									},
								},
							},
						},
					},
				},
			},
		})

		const values = normalizeSchemaValues(
			schema,
			{
				related: [
					{
						textField: 'hello!',
						nested: new StaticSchemaEntityImplementation(secondLevelSchema, {
							boolField: true,
						}),
					},
				],
			},
			{ shouldCreateEntityInstances: false }
		)

		assert.isFalse(
			values.related[0] instanceof StaticSchemaEntityImplementation
		)
		assert.isFalse(
			values.related[0].nested instanceof StaticSchemaEntityImplementation
		)

		assert.isEqualDeep(values, {
			related: [
				{
					textField: 'hello!',
					nested: { boolField: true },
				},
			],
		})
	}
}
