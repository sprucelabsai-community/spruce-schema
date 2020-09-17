import { test, assert } from '@sprucelabs/test'
import { buildSchema } from '../..'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import makeFieldsOptional from '../../utilities/makeFieldsOptional'

const personSchema = buildSchema({
	id: 'person-with-all-required',
	name: 'Person (all required fields)',
	fields: {
		firstName: {
			type: 'text',
			isRequired: true,
		},
		lastName: {
			type: 'text',
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
					type: 'text',
					isRequired: false,
				},
				lastName: {
					type: 'text',
					isRequired: false,
				},
			},
		})
	}
}
