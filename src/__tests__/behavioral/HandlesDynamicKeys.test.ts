import { assert, test } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import DynamicSchemaEntity from '../../DynamicSchemaEntity'
import { DynamicSchemaAllValues, ISchema } from '../../schemas.static.types'
import buildSchema from '../../utilities/buildSchema'

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

export default class CanValidateDynamicKeysTest extends AbstractSchemaTest {
	@test()
	protected static canCreateSchemaEntityWithDynamicKeys() {
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
}
