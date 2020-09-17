// TODO figure out how to get schema field mixins working from buildSchema (SchemaDefinitionValues fails)
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { ISchema } from '../../schemas.static.types'
import buildSchema from '../../utilities/buildSchema'

export default class BuildSchemaTest extends AbstractSpruceTest {
	@test()
	protected static async testBasicSchemaBuilding() {
		const schema = buildSchema({
			id: 'test-1',
			name: 'test 1',
			fields: {
				firstName: {
					type: 'text',
				},
			},
		})
		assert.isTruthy(schema)
		assert.isTruthy(schema.fields.firstName)
	}

	@test()
	protected static async testBuiltSchemaType() {
		const schema = buildSchema({
			id: 'test-2',
			name: 'test two',
			fields: {
				skillName: {
					type: 'text',
					label: 'Name',
					isRequired: true,
					hint: "What's the name of your skill?",
				},
				description: {
					type: 'text',
					label: 'Description',
					isRequired: true,
					hint: 'How would you describe your skill?',
				},
			},
		})

		type TestType = typeof schema
		const test = <T extends ISchema>(def: T): T => def

		test<typeof schema>(schema)
		test<TestType>(schema)
	}
}
