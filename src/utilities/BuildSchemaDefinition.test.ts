// TODO figure out how to get schema field mixins working from buildSchemaDefinition (SchemaDefinitionValues fails)
import BaseTest, { test, assert } from '@sprucelabs/test'
import { buildSchemaDefinition } from '..'
import FieldType from '#spruce:schema/fields/fieldType'
import { ISchemaDefinition } from '../schema.types'

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
	// @test('Test mixing in field to the schema with object literal')
	// protected static testMixingInFieldsWithObjectLiteral(
	// 	t: ExecutionContext<IContext>
	// ) {
	// 	const schema = buildSchemaDefinition(
	// 		{
	// 			id: 'test-1',
	// 			name: 'test 1',
	// 			fields: {
	// 				firstName: {
	// 					type: FieldType.Text,
	// 					label: 'First name'
	// 				}
	// 			}
	// 		},
	// 		{
	// 			lastName: {
	// 				type: FieldType.Text,
	// 				label: 'Last name'
	// 			}
	// 		}
	// 	)
	// 	assert.isOk(schema.fields.lastName)
	// 	t.is(schema.fields.firstName.label, 'First name')
	// }
	// @test('Try mixing fields of 2 schemas')
	// protected static testMixingInMultipleSchemas(t: ExecutionContext<IContext>) {
	// 	const user = buildSchemaDefinition({
	// 		id: 'test-1',
	// 		name: 'test 1',
	// 		fields: {
	// 			firstName: {
	// 				type: FieldType.Text,
	// 				label: 'First name'
	// 			}
	// 		}
	// 	})
	// 	const userWithLastName = buildSchemaDefinition(
	// 		{
	// 			id: 'test-1',
	// 			name: 'test 1',
	// 			fields: {
	// 				lastName: {
	// 					type: FieldType.Text,
	// 					label: 'Last name'
	// 				}
	// 			}
	// 		},
	// 		user.fields
	// 	)
	// 	const userWithToken = buildSchemaDefinition(
	// 		{
	// 			id: 'test-1',
	// 			name: 'test 1',
	// 			fields: {
	// 				token: {
	// 					type: FieldType.Text,
	// 					label: 'Token'
	// 				}
	// 			}
	// 		},
	// 		userWithLastName.fields
	// 	)
	// 	t.is(user.fields.firstName.label, 'First name')
	// 	t.is(userWithLastName.fields.firstName.label, 'First name')
	// 	t.is(userWithLastName.fields.lastName.label, 'Last name')
	// 	t.is(userWithToken.fields.token.label, 'Token')
	// 	const userValues: SchemaDefinitionValues<typeof user> = {}
	// 	userValues.token
	// 	assert.isOk(userValues)
	// }
}
