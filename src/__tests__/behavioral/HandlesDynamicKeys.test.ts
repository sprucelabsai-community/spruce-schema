import { assert, test } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import SchemaEntity, { buildSchema } from '../..'
import AbstractSchemaTest from '../../AbstractSchemaTest'

const simpleDynamicSchema = buildSchema({
	id: 'simpleDynamic',
	name: 'Simple dynamic',
	dynamicFieldSignature: {
		type: FieldType.Text,
		keyName: 'key',
	},
})

export default class CanValidateDynamicKeysTest extends AbstractSchemaTest {
	@test.skip()
	protected static async canCreateSchemaEntityWithDynamicKeys() {
		const entity = new SchemaEntity(simpleDynamicSchema)
		assert.isTruthy(entity)
	}
}
