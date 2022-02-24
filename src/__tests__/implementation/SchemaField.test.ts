import { test, assert } from '@sprucelabs/test'
import { errorAssert } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import SchemaField from '../../fields/SchemaField'

export default class SchemaFieldTest extends AbstractSchemaTest {
	@test()
	protected static async templateItemMissingNamespaceThrowsHelpfulMessage() {
		const err = assert.doesThrow(() =>
			SchemaField.generateTemplateDetails({
				templateItems: [
					{
						id: 'test',
						nameCamel: 'test',
						destinationDir: '',
					} as any,
				],
				definition: {
					type: 'schema',
					options: {
						schema: {
							id: 'test',
							version: 'test',
							namespace: 'lotto',
						},
					},
				},
			} as any)
		)

		errorAssert.assertError(err, 'INVALID_SCHEMA_REFERENCE')
	}

	@test()
	protected static async templateItemIdNamespaceThrowsHelpfulMessage() {
		const err = assert.doesThrow(() =>
			SchemaField.generateTemplateDetails({
				templateItems: [
					{
						nameCamel: 'test',
						destinationDir: '',
						namespace: 'whatever',
					} as any,
				],
				definition: {
					type: 'schema',
					options: {
						schema: {
							id: 'test',
							version: 'test',
							namespace: 'lotto',
						},
					},
				},
			} as any)
		)

		errorAssert.assertError(err, 'INVALID_SCHEMA_REFERENCE')
	}
}
