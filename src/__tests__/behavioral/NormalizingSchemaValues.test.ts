import { test, assert } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import { SchemaValues } from '../../schemas.static.types'
import StaticSchemaEntityImplementation from '../../StaticSchemaEntityImplementation'
import buildSchema from '../../utilities/buildSchema'
import normalizePartialSchemaValues from '../../utilities/normalizePartialSchemaValues'
import normalizeSchemaValues from '../../utilities/normalizeSchemaValues'

export default class NormalizingSchemaValues extends AbstractSchemaTest {
	private static get personSchema() {
		return testPersonSchema
	}

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
			nestedArraySchema: [
				{ field1: 'first', field2: undefined },
				{ field1: 'second', field2: undefined },
			],
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

	@test()
	protected static async canNormalizePartialValuesPassesBack() {
		this.assertPartialNormalizesToWhatIsPassed({
			firstName: 'tay',
		})

		this.assertPartialNormalizesToWhatIsPassed({
			firstName: 'tay',
			age: 10,
		})
	}

	@test()
	protected static async normalizePartialNormalizesValues() {
		this.assertPartialNormalizesTo(
			{
				age: '10' as any,
				boolean: false,
			},
			{
				age: 10,
				boolean: false,
			}
		)
	}

	@test()
	protected static async betterNormalizePartialTyping() {
		const actual = normalizePartialSchemaValues(this.personSchema, {
			age: 10,
		})

		assert.isExactType<
			typeof actual,
			{
				age: number | null
			}
		>(true)
	}

	@test()
	protected static async partialNormalizesNestedSchemaValues() {
		const values: Partial<TestPerson> = {
			nestedArraySchema: [
				{
					field1: 'first',
				},
			],
		}

		this.assertPartialNormalizesTo(values, values)
	}

	@test()
	protected static async canNormalizeValuesStrippingUndefinedAndNull() {
		const values = normalizeSchemaValues(
			this.personSchema,
			{
				age: null,
				boolean: true,
				firstName: 'test',
				nestedArraySchema: null,
			},
			{
				shouldStripUndefinedAndNullValues: true,
			}
		)

		assert.isEqualDeep(values as any, {
			boolean: true,
			firstName: 'test',
		})
	}

	@test()
	protected static async canStripUndefinedAndNullValuesFromNested() {
		const values = normalizeSchemaValues(
			this.personSchema,
			{
				firstName: 'test',
				nestedArraySchema: [
					{
						field1: 'first',
						field2: null,
					},
					{
						field1: undefined,
						field2: 'second',
					},
				],
			},
			{
				shouldStripUndefinedAndNullValues: true,
			}
		)

		assert.isEqualDeep(values as any, {
			firstName: 'test',
			nestedArraySchema: [
				{
					field1: 'first',
				},
				{
					field2: 'second',
				},
			],
		})
	}

	@test()
	protected static async nestedFieldsDontGetSkippedByIncludeFields() {
		const values = normalizeSchemaValues(
			this.personSchema,
			{
				firstName: 'test',
				nestedArraySchema: [
					{
						field1: 'first',
						field2: null,
					},
					{
						field1: undefined,
						field2: 'second',
					},
				],
			},
			{
				fields: ['nestedArraySchema'],
			}
		)

		assert.isEqualDeep(values as any, {
			nestedArraySchema: [
				{
					field1: 'first',
					field2: null,
				},
				{
					field1: undefined,
					field2: 'second',
				},
			],
		})
	}

	private static assertPartialNormalizesTo(
		values: Record<string, any>,
		expected: Partial<TestPerson>
	) {
		const normalized = this.normalizePartial(values)
		assert.isEqualDeep(normalized, expected)
	}

	private static assertPartialNormalizesToWhatIsPassed(
		expected: Partial<TestPerson>
	) {
		const values = this.normalizePartial(expected)
		assert.isEqualDeep(values, expected)
	}

	private static normalizePartial(expected: Partial<TestPerson>) {
		return normalizePartialSchemaValues(this.personSchema, expected)
	}
}

const testPersonSchema = buildSchema({
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
						field2: {
							type: 'text',
						},
					},
				},
			},
		},
	},
})

type TestPersonSchema = typeof testPersonSchema
type TestPerson = SchemaValues<TestPersonSchema>
