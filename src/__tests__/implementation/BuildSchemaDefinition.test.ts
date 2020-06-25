// TODO figure out how to get schema field mixins working from buildSchemaDefinition (SchemaDefinitionValues fails)
import BaseTest, { test, assert } from '@sprucelabs/test'
import { buildSchemaDefinition } from '../..'
import FieldType from '#spruce:schema/fields/fieldType'
import { ISchemaDefinition } from '../../schema.types'

export default class BuildSchemaDefinitionTest extends BaseTest {
	@test('Can build schema (will always pass, but fail lint)')
	protected static async testBasicSchemaBuilding() {
		const schema = buildSchemaDefinition({
			id: 'test-1',
			name: 'test 1',
			fields: {
				firstName: {
					type: FieldType.Text
				}
			}
		})
		assert.isOk(schema)
		assert.isOk(schema.fields.firstName)
	}

	@test('test built schema type')
	protected static async testBuiltSchemaType() {
		const schema = buildSchemaDefinition({
			id: 'test-2',
			name: 'test two',
			fields: {
				skillName: {
					type: FieldType.Text,
					label: 'Name',
					isRequired: true,
					hint: "What's the name of your skill?"
				},
				description: {
					type: FieldType.Text,
					label: 'Description',
					isRequired: true,
					hint: 'How would you describe your skill?'
				}
			}
		})

		type TestType = typeof schema
		const test = <T extends ISchemaDefinition>(def: T): T => def

		test<typeof schema>(schema)
		test<TestType>(schema)
	}
}
