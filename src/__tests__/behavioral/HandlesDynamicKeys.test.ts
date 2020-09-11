import { assert, test } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import SchemaEntity, { buildSchema } from '../..'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import { SchemaValues } from '../../schemas.static.types'
import normalizeSchemaValues from '../../utilities/normalizeSchemaValues'

const simpleDynamicSchema = buildSchema({
	id: 'simpleDynamic',
	name: 'Simple dynamic',
	dynamicFieldSignature: {
		type: FieldType.Text,
		keyName: 'key',
	},
})

const staticFieldSchema = buildSchema({
	id: 'simpleStatic',
	name: 'Simple static',
	fields: {
		onlyField: {
			type: FieldType.Text,
		},
	},
})

export default class CanValidateDynamicKeysTest extends AbstractSchemaTest {
	@test()
	protected static async canCreateSchemaEntityWithDynamicKeys() {
		const entity = new SchemaEntity(simpleDynamicSchema)
		assert.isTruthy(entity)
	}

	@test()
	protected static async canCreateSchemaEntityWithDynamicValues() {
		const entity = new SchemaEntity(simpleDynamicSchema, {
			foo: 'bar',
			hello: 'world',
		})

		assert.isEqual(entity.get('foo'), 'bar')
		assert.isEqual(entity.get('hello'), 'world')
	}

	@test()
	protected static async canNormalizeUsingSchemaEntity() {
		const entity = new SchemaEntity(simpleDynamicSchema, {
			//@ts-ignore
			foo: 1,
			hello: 'world',
		})

		assert.isEqual(entity.get('foo'), '1')
		assert.isEqual(entity.get('hello'), 'world')

		const foo = entity.get('foo')
		assert.isExactType<typeof foo, string | undefined | null>(true)

		const values = entity.getValues()

		assert.isEqual(values.foo, '1')
	}

	@test()
	protected static async canNormalizeDynamicValues() {
		//@ts-ignore
		const normalized = normalizeSchemaValues(simpleDynamicSchema, { foo: 3 })
		assert.isEqualDeep(normalized, { foo: '3' })
	}

	@test()
	protected static async canNormalizeDynamicValuesAndPassTypesChecks() {
		const normalized = normalizeSchemaValues(simpleDynamicSchema, { foo: '3' })
		assert.isEqualDeep(normalized, { foo: '3' })
	}

	@test()
	protected static async typesSchemaWithStaticFieldsValuesNicely() {
		const values: SchemaValues<typeof staticFieldSchema> = { onlyField: 'yes!' }
		const normalized = normalizeSchemaValues(staticFieldSchema, values)
		assert.isEqualDeep(normalized, values)
	}
}
