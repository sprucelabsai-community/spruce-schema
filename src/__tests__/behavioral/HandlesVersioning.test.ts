import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import FieldType from '../../fields/fieldTypeEnum'
import Schema from '../../Schema'
import buildSchemaDefinition from '../../utilities/buildSchemaDefinition'

export default class HandlesVersioningTest extends AbstractSpruceTest {
	@test()
	protected static async letsMeBuildASchemaWithSameNameAndVersions() {
		const { wrenchV1, wrenchV2 } = this.buildDefinitions()

		assert.isOk(wrenchV1)
		assert.isOk(wrenchV2)
	}

	private static buildDefinitions() {
		const wrenchV1 = buildSchemaDefinition({
			id: 'wrench',
			name: 'Wrench',
			version: 'v1',
			fields: {
				length: {
					type: FieldType.Number
				}
			}
		})
		const wrenchV2 = buildSchemaDefinition({
			id: 'wrench',
			name: 'Wrench',
			version: 'v2',
			fields: {
				length: {
					type: FieldType.Number
				},
				diameter: {
					type: FieldType.Number,
					isRequired: true
				}
			}
		})
		return { wrenchV1, wrenchV2 }
	}

	@test()
	protected static async canAccessSchemaById() {
		this.buildDefinitions()

		const wrenchV1 = Schema.getDefinition('wrench', 'v1')
		const wrenchV2 = Schema.getDefinition('wrench', 'v2')

		assert.isOk(wrenchV1)
		assert.isOk(wrenchV2)
	}

	@test()
	protected static async getsBackCorrectSchema() {
		this.buildDefinitions()

		const wrenchV1 = Schema.getDefinition('wrench', 'v1')
		const wrenchV2 = Schema.getDefinition('wrench', 'v2')

		assert.isOk(wrenchV1)
		assert.isOk(wrenchV2)

		assert.isEqual(wrenchV1.id, 'wrench')
		assert.isEqual(wrenchV2.id, 'wrench')

		assert.isNotEqual(wrenchV1.version, wrenchV2.version)
	}

	@test()
	protected static async throwsIfYouForgetAVersionOnAVersioned() {
		assert.doesThrow(
			() => Schema.getDefinition('wrench'),
			/VERSION_NOT_FOUND/gi
		)
	}
}
