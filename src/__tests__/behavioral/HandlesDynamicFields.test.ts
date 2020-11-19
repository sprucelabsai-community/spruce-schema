import { assert, test } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import DynamicSchemaEntity from '../../DynamicSchemaEntity'
import {
	DynamicSchemaAllValues,
	ISchema,
	SchemaAllValues,
	SchemaValues,
} from '../../schemas.static.types'
import areSchemaValuesValid from '../../utilities/areSchemaValuesValid'
import buildSchema from '../../utilities/buildSchema'
import normalizeSchemaValues from '../../utilities/normalizeSchemaValues'
import validateSchemaValues from '../../utilities/validateSchemaValues'

const textDynamicSchema = buildSchema({
	id: 'textDynamic',
	name: 'Dynamic text based schema',
	dynamicFieldSignature: {
		type: 'text',
		keyName: 'key',
	},
})

const numberDynamicSchema = buildSchema({
	id: 'numberDynamic',
	name: 'Dynamic number based schema',
	dynamicFieldSignature: {
		type: 'number',
		keyName: 'key',
	},
})

const numberRequiredDynamicSchema = buildSchema({
	id: 'numberRequiredDynamic',
	name: 'Dynamic number based schema',
	dynamicFieldSignature: {
		type: 'number',
		isRequired: true,
		keyName: 'key',
	},
})

const arrayRequiredDynamicSchema = buildSchema({
	id: 'arrayRequiredDynamic',
	name: 'Dynamic number based schema',
	dynamicFieldSignature: {
		type: 'number',
		isRequired: true,
		isArray: true,
		keyName: 'key',
	},
})

export default class HandlesDynamicFields extends AbstractSchemaTest {
	@test()
	protected static canCreateSchemaEntityWithDynamicFields() {
		const entity = new DynamicSchemaEntity(textDynamicSchema)
		assert.isTruthy(entity)
	}

	@test()
	protected static optionalValuesTypeMapping() {
		const values: DynamicSchemaAllValues<typeof numberDynamicSchema> = {
			hey: 5,
		}

		assert.isExactType<typeof values, { string?: number }>(true)
	}

	@test()
	protected static requiredValuesTypeMapping() {
		const values: DynamicSchemaAllValues<typeof numberRequiredDynamicSchema> = {
			hey: 5,
		}

		assert.isExactType<typeof values, Record<string, number>>(true)
		assert.isExactType<typeof values, Record<string, number | undefined>>(false)
	}

	@test()
	protected static typesStringValuesProperly() {
		const entity = new DynamicSchemaEntity(textDynamicSchema, {
			anything: 'foo',
			anythingElse: 'bar',
		})

		const values = entity.getValues()

		assert.isExactType<typeof values, { string?: string }>(true)
	}

	@test()
	protected static typesNumbersValuesProperly() {
		const entity = new DynamicSchemaEntity(numberDynamicSchema, {
			anything: 1,
			anythingElse: 3,
		})

		const values = entity.getValues()

		assert.isExactType<typeof values, { string?: number }>(true)
	}

	@test()
	protected static typesRequiredNumbersValuesProperly() {
		const entity = new DynamicSchemaEntity(numberRequiredDynamicSchema, {
			anything: 1,
			anythingElse: 3,
		})

		const values = entity.getValues()

		assert.isExactType<typeof values, Record<string, number>>(true)
		assert.isExactType<typeof values, Record<string, number | undefined>>(false)
	}

	@test(
		'simple string passthrough',
		textDynamicSchema,
		{ foo: 'bar', hello: 'world' },
		{ foo: 'bar', hello: 'world' }
	)
	@test(
		'simple number passthrough',
		numberDynamicSchema,
		{ foo: 1, hello: 2 },
		{ foo: 1, hello: 2 }
	)
	@test(
		'transforms to strings',
		textDynamicSchema,
		{ foo: 1, hello: 2 },
		{ foo: '1', hello: '2' }
	)
	@test(
		'transforms to numbers+array',
		arrayRequiredDynamicSchema,
		{
			foo: 1,
			bar: 2,
		},
		{
			foo: [1],
			bar: [2],
		}
	)
	protected static getValuesTransformation(
		schema: ISchema,
		values: any,
		expected: any
	) {
		const entity = new DynamicSchemaEntity(schema, values)
		const actual = entity.getValues()

		assert.isEqualDeep(actual, expected)

		const entity2 = new DynamicSchemaEntity(schema)
		entity2.setValues(values)
		const actual2 = entity.getValues()
		assert.isEqualDeep(actual2, expected)
	}

	@test()
	protected static canValidate() {
		const entity = new DynamicSchemaEntity(textDynamicSchema, {
			//@ts-ignore
			foo: { another: 'object' },
		})

		assert.doesThrow(
			() => entity.validate(),
			/could not be converted to a string/
		)

		assert.isFalse(entity.isValid())
	}

	@test()
	protected static canValidateUsingUtilityFunction() {
		const values = {
			foo: { another: 'object' },
		}
		assert.doesThrow(
			//@ts-ignore
			() => validateSchemaValues(textDynamicSchema, values),
			/could not be converted to a string/
		)

		//@ts-ignore
		assert.isFalse(areSchemaValuesValid(textDynamicSchema, values))
	}

	@test()
	protected static getsSets() {
		const entity = new DynamicSchemaEntity(textDynamicSchema)
		entity.set('foo', 'bar')
		assert.isEqual(entity.get('foo'), 'bar')

		//@ts-ignore
		entity.set('bar', 3)
		assert.isEqual(entity.get('bar'), '3')
	}

	@test()
	protected static throwsOnBadSet() {
		const entity = new DynamicSchemaEntity(numberDynamicSchema)
		assert.doesThrow(
			//@ts-ignore
			() => entity.set('foo', { hello: 'world' }),
			/converted to a number/
		)
	}

	@test()
	protected static typesAndNormalizedRelatedSchemasWithDynamicFields() {
		const fullSchema = buildSchema({
			id: 'fullMessageAdapter',
			fields: {
				id: {
					type: 'id',
					isRequired: true,
				},
				dateCreated: {
					type: 'number',
					isRequired: true,
				},
				adapterName: {
					type: 'text',
					isRequired: true,
				},
				settings: {
					type: 'schema',
					isRequired: true,
					options: {
						schema: buildSchema({
							id: 'messageAdapterSettings',
							dynamicFieldSignature: {
								type: 'text',
								keyName: 'key',
							},
						}),
					},
				},
			},
		})

		type Values = SchemaValues<typeof fullSchema>
		type AllValues = SchemaAllValues<typeof fullSchema>

		const values: Values = {
			id: '1',
			dateCreated: 2,
			adapterName: '3',
			settings: {},
		}

		values.settings.anything = 'true'

		assert.isExactType<
			typeof values,
			{
				id: string
				dateCreated: number
				adapterName: string
				settings: Record<string, string | null | undefined>
			}
		>(true)

		const allValues: AllValues = {
			id: '1',
			dateCreated: 2,
			adapterName: '3',
			settings: {
				first: 'first',
			},
		}

		assert.isExactType<
			typeof allValues,
			{
				id: string
				dateCreated: number
				adapterName: string
				settings: Record<string, string | null | undefined>
			}
		>(true)

		const normalized = normalizeSchemaValues(
			fullSchema,
			{
				//@ts-ignore
				id: 1,
				//@ts-ignore
				dateCreated: '2',
				//@ts-ignore
				adapterName: 4,
				settings: {
					first: 'first',
					//@ts-ignore
					second: 2,
				},
			},
			{ includePrivateFields: false }
		)

		assert.isEqualDeep(normalized, {
			id: '1',
			dateCreated: 2,
			adapterName: '4',
			settings: {
				first: 'first',
				second: '2',
			},
		})
	}

	@test()
	protected static typesAndNormalizesDynamicSchemas() {
		const fullSchema = buildSchema({
			id: 'aDynamicSchema',
			dynamicFieldSignature: {
				type: 'text',
				keyName: 'key',
			},
		})

		type Values = SchemaValues<typeof fullSchema>

		const values: Values = {
			id: '1',
			dateCreated: 'hey',
			adapterName: '3',
			settings: 'there',
		}

		values.anything = 'true'

		assert.isExactType<
			typeof values,
			{
				[key: string]: string | undefined | null
			}
		>(true)

		const normalized = normalizeSchemaValues(fullSchema, {
			//@ts-ignore
			id: 1,
			//@ts-ignore
			dateCreated: '2',
			//@ts-ignore
			adapterName: 4,
		})

		assert.isEqualDeep(normalized, {
			id: '1',
			dateCreated: '2',
			adapterName: '4',
		})
	}
}
