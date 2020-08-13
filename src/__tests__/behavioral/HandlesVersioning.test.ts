import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import SchemaEntity from '../../SchemaEntity'
import buildSchema from '../../utilities/buildSchema'

export default class HandlesVersioningTest extends AbstractSpruceTest {
	@test()
	protected static async letsMeBuildASchemaWithSameNameAndVersions() {
		const { wrenchV1, wrenchV2 } = this.buildDefinitions()

		assert.isTruthy(wrenchV1)
		assert.isTruthy(wrenchV2)
	}

	private static buildDefinitions() {
		const wrenchV1 = buildSchema({
			id: 'wrench',
			name: 'Wrench',
			version: 'v1',
			fields: {
				length: {
					type: FieldType.Number,
				},
			},
		})
		const wrenchV2 = buildSchema({
			id: 'wrench',
			name: 'Wrench',
			version: 'v2',
			fields: {
				length: {
					type: FieldType.Number,
				},
				diameter: {
					type: FieldType.Number,
					isRequired: true,
				},
			},
		})
		return { wrenchV1, wrenchV2 }
	}

	@test()
	protected static async canAccessSchemaById() {
		this.buildDefinitions()

		const wrenchV1 = SchemaEntity.getSchema('wrench', 'v1')
		const wrenchV2 = SchemaEntity.getSchema('wrench', 'v2')

		assert.isTruthy(wrenchV1)
		assert.isTruthy(wrenchV2)
	}

	@test()
	protected static async getsBackCorrectSchema() {
		this.buildDefinitions()

		const wrenchV1 = SchemaEntity.getSchema('wrench', 'v1')
		const wrenchV2 = SchemaEntity.getSchema('wrench', 'v2')

		assert.isTruthy(wrenchV1)
		assert.isTruthy(wrenchV2)

		assert.isEqual(wrenchV1.id, 'wrench')
		assert.isEqual(wrenchV2.id, 'wrench')

		assert.isNotEqual(wrenchV1.version, wrenchV2.version)
	}

	@test()
	protected static async throwsIfYouForgetAVersionOnAVersioned() {
		assert.doesThrow(
			() => SchemaEntity.getSchema('wrench'),
			/VERSION_NOT_FOUND/gi
		)
	}
}
