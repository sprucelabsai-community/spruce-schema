import { test, assert } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import buildSchema from '../../utilities/buildSchema'
import { pickFields } from '../../utilities/pickFields'

export default class PickingFieldsTest extends AbstractSchemaTest {
	@test()
	protected static async canCreatePickingFields() {
		assert.isFunction(pickFields)
	}

	@test()
	protected static async canGetOneField() {
		const results = pickFields(schema1.fields, ['id'])
		assert.isEqualDeep(results, {
			id: schema1.fields.id,
		})
	}

	@test()
	protected static async canGetMultipleFields() {
		const results = pickFields(schema1.fields, ['id', 'firstName'])

		assert.isEqualDeep(results, {
			id: schema1.fields.id,
			firstName: schema1.fields.firstName,
		})
	}
}

const schema1 = buildSchema({
	id: 'schema1',
	fields: {
		id: {
			type: 'id',
			isRequired: true,
		},
		firstName: {
			type: 'text',
		},
	},
})
