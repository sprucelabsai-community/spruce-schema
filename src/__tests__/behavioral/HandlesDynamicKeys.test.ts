import { assert, test } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import SchemaEntity, { buildSchema } from '../..'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import normalizeSchemaValues from '../../utilities/normalizeSchemaValues'

const simpleDynamicSchema = buildSchema({
	id: 'simpleDynamic',
	name: 'Simple dynamic',
	dynamicFieldSignature: {
		type: FieldType.Text,
		keyName: 'key',
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
}
