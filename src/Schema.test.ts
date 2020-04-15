import '@sprucelabs/path-resolver/register'
import BaseTest, { test } from '@sprucelabs/test'
import { ExecutionContext } from 'ava'
import buildSchemaDefinition from './utilities/buildSchemaDefinition'
import Schema from '.'
import { FieldType } from '#spruce:schema/fields/fieldType'

/** Context just for this test */
interface IContext {}

export default class SchemaTest extends BaseTest {
	@test('Can do basic definition validation')
	protected static async canAccessSpruce(t: ExecutionContext<IContext>) {
		const definition = buildSchemaDefinition({
			id: 'simple-test',
			name: 'Simple Test Schema'
		})

		t.false(
			Schema.isDefinitionValid(definition),
			'Bad definition incorrectly passed valid check'
		)
	}

	@test('Can make is array out of value')
	protected static async canIsArrayValue(t: ExecutionContext<IContext>) {
		const definition = buildSchemaDefinition({
			id: 'is-array-test',
			name: 'is array',
			fields: {
				name: {
					type: FieldType.Text,
					label: 'Name',
					value: 'Taylor',
					defaultValue: 'Taylor'
				},
				nicknames: {
					type: FieldType.Text,
					label: 'Nick names',
					isArray: true,
					value: ['Tay', 'Taylor']
				}
			}
		})

		t.true(Schema.isDefinitionValid(definition))
	}
}
