import { test, assert } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import buildSchema from '../../utilities/buildSchema'

export default class HandlesVersioningTest extends AbstractSchemaTest {
	@test()
	protected static async letsMeBuildASchemaWithSameNameAndVersions() {
		const { wrenchV1, wrenchV2 } = this.buildSchemas()

		assert.isTruthy(wrenchV1)
		assert.isTruthy(wrenchV2)
	}

	private static buildSchemas() {
		const wrenchV1 = buildSchema({
			id: 'wrench',
			name: 'Wrench',
			version: 'v1',
			fields: {
				length: {
					type: 'number',
				},
			},
		})
		const wrenchV2 = buildSchema({
			id: 'wrench',
			name: 'Wrench',
			version: 'v2',
			fields: {
				length: {
					type: 'number',
				},
				diameter: {
					type: 'number',
					isRequired: true,
				},
			},
		})
		return { wrenchV1, wrenchV2 }
	}

	@test()
	protected static async canAccessSchemaById() {
		this.buildSchemas()

		const wrenchV1 = this.registry.getSchema('wrench', 'v1')
		const wrenchV2 = this.registry.getSchema('wrench', 'v2')

		assert.isTruthy(wrenchV1)
		assert.isTruthy(wrenchV2)
	}

	@test()
	protected static async getsBackCorrectSchema() {
		this.buildSchemas()

		const wrenchV1 = this.registry.getSchema('wrench', 'v1')
		const wrenchV2 = this.registry.getSchema('wrench', 'v2')

		assert.isTruthy(wrenchV1)
		assert.isTruthy(wrenchV2)

		assert.isEqual(wrenchV1.id, 'wrench')
		assert.isEqual(wrenchV2.id, 'wrench')

		assert.isNotEqual(wrenchV1.version, wrenchV2.version)
	}

	@test()
	protected static async throwsIfYouForgetAVersionOnAVersioned() {
		this.buildSchemas()
		assert.doesThrow(
			() => this.registry.getSchema('wrench'),
			/VERSION_NOT_FOUND/gi
		)
	}
}
