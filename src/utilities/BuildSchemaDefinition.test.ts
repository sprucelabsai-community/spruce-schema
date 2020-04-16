import '@sprucelabs/path-resolver/register'
import BaseTest, { test } from '@sprucelabs/test'
import { ExecutionContext } from 'ava'
import { buildSchemaDefinition } from '..'
import { FieldType } from '../fields/fieldType'

/** Context just for this test */
interface IContext {}

export default class BuildSchemaDefinitionTest extends BaseTest {
	@test('Can build schema (will always pass, but fail lint)')
	protected static async testBasicSchemaBuilding(
		t: ExecutionContext<IContext>
	) {
		const schema = buildSchemaDefinition({
			id: 'test-1',
			name: 'test 1',
			fields: {
				firstName: {
					type: FieldType.Text
				}
			}
		})
		t.assert(schema)
		t.assert(schema.fields.firstName)
	}

	@test('Test mixing in field to the schema with object literal')
	protected static testMixingInFieldsWithObjectLiteral(
		t: ExecutionContext<IContext>
	) {
		const schema = buildSchemaDefinition(
			{
				id: 'test-1',
				name: 'test 1',
				fields: {
					firstName: {
						type: FieldType.Text,
						label: 'First name'
					}
				}
			},
			{
				lastName: {
					type: FieldType.Text,
					label: 'Last name'
				}
			}
		)

		t.assert(schema.fields.lastName)
		t.is(schema.fields.firstName.label, 'First name')
	}

	@test('Try mixing fields of 2 schemas')
	protected static testMixingInMultipleSchemas(t: ExecutionContext<IContext>) {
		const user = buildSchemaDefinition({
			id: 'test-1',
			name: 'test 1',
			fields: {
				firstName: {
					type: FieldType.Text,
					label: 'First name'
				}
			}
		})

		const userWithLastName = buildSchemaDefinition(
			{
				id: 'test-1',
				name: 'test 1',
				fields: {
					lastName: {
						type: FieldType.Text,
						label: 'Last name'
					}
				}
			},
			user.fields
		)

		const userWithToken = buildSchemaDefinition(
			{
				id: 'test-1',
				name: 'test 1',
				fields: {
					token: {
						type: FieldType.Text,
						label: 'Token'
					}
				}
			},
			userWithLastName.fields
		)

		t.is(user.fields.firstName.label, 'First name')
		t.is(userWithLastName.fields.firstName.label, 'First name')
		t.is(userWithLastName.fields.lastName.label, 'Last name')
		t.is(userWithToken.fields.token.label, 'Token')
	}
}
