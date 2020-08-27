import { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { buildSchema } from '../..'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import dropFields from '../../utilities/dropFields'

const personSchema = buildSchema({
	id: 'person-with-all-fields',
	name: 'Person (all fields)',
	fields: {
		firstName: {
			type: FieldType.Text,
			isRequired: true,
		},
		lastName: {
			type: FieldType.Text,
			isRequired: true,
		},
	},
})

export default class DroppingFieldsTest extends AbstractSchemaTest {
	@test()
	protected static async droppingFields() {
		const optionalPerson = {
			...personSchema,
			fields: {
				...dropFields(personSchema.fields, ['firstName']),
			},
		}

		assert.isEqualDeep(optionalPerson, {
			id: 'person-with-all-fields',
			name: 'Person (all fields)',
			fields: {
				lastName: {
					type: FieldType.Text,
					isRequired: true,
				},
			},
		})
	}
}
