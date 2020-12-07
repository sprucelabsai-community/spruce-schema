import { test, assert } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import { Schema, SchemaIdWithVersion } from '../../schemas.static.types'
import normalizeSchemaToIdWithVersion from '../../utilities/normalizeSchemaToIdWithVersion'

export default class NormalizeToSchemaIdWithVersionTest extends AbstractSchemaTest {
	@test()
	protected static async functionExists() {
		assert.isFunction(normalizeSchemaToIdWithVersion)
	}

	@test(
		'does nothing to idWithVersion',
		{
			id: 'test',
		},
		{
			id: 'test',
		}
	)
	@test(
		'converts schema to idWithVersion',
		{
			id: 'test',
			fields: {
				textfield: {
					type: 'text',
				},
			},
		},
		{
			id: 'test',
		}
	)
	@test(
		'maintains version',
		{
			id: 'test',
			version: '1.0',
			fields: {
				textfield: {
					type: 'text',
				},
			},
		},
		{
			id: 'test',
			version: '1.0',
		}
	)
	@test(
		'maintains namespace and version',
		{
			id: 'test',
			version: '1.0',
			namespace: 'test',
			fields: {
				textfield: {
					type: 'text',
				},
			},
		},
		{
			id: 'test',
			namespace: 'test',
			version: '1.0',
		}
	)
	protected static async testNormalizing(
		schemaOrIdWithVersion: Schema | SchemaIdWithVersion,
		expected: SchemaIdWithVersion
	) {
		const actual = normalizeSchemaToIdWithVersion(schemaOrIdWithVersion)
		assert.isEqualDeep(actual, expected)
	}
}
