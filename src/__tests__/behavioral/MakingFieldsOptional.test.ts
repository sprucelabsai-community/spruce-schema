import { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { buildSchema } from '../..'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import makeFieldsOptional from '../../utilities/makeFieldsOptional'

const personSchema = buildSchema({
	id: 'person-with-all-required',
	name: 'Person (all required fields)',
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

export default class MakingFieldsOptionalTest extends AbstractSchemaTest {
	@test()
	protected static async makeFieldsOptional() {
		const optionalPerson = {
			...personSchema,
			fields: {
				...makeFieldsOptional(personSchema.fields),
			},
		}

		assert.isEqualDeep(optionalPerson, {
			id: 'person-with-all-required',
			name: 'Person (all required fields)',
			fields: {
				firstName: {
					type: FieldType.Text,
					isRequired: false,
				},
				lastName: {
					type: FieldType.Text,
					isRequired: false,
				},
			},
		})
	}
}
