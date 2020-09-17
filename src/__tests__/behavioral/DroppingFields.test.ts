import { test, assert } from '@sprucelabs/test'
import { buildSchema } from '../..'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import dropFields from '../../utilities/dropFields'
import dropPrivateFields from '../../utilities/dropPrivateFields'

const personSchema = buildSchema({
	id: 'person-with-all-fields',
	name: 'Person (all fields)',
	fields: {
		firstName: {
			type: 'text',
			isRequired: true,
		},
		lastName: {
			type: 'text',
			isRequired: true,
		},
		privateField: {
			type: 'text',
			isPrivate: true,
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
					type: 'text',
					isRequired: true,
				},
				privateField: {
					type: 'text',
					isPrivate: true,
				},
			},
		})

		assert.isExactType<
			typeof optionalPerson,
			{
				id: string
				name: string
				fields: {
					lastName: {
						type: 'text'
						isRequired: true
					}
					privateField: {
						type: 'text'
						isPrivate: true
					}
				}
			}
		>(true)
	}

	@test()
	protected static async droppingPrivateFields() {
		const publicPerson = {
			...personSchema,
			fields: {
				...dropPrivateFields(personSchema.fields),
			},
		}

		assert.isExactType<
			typeof publicPerson,
			{
				id: string
				name: string
				fields: {
					firstName: {
						type: 'text'
						isRequired: true
					}
					lastName: {
						type: 'text'
						isRequired: true
					}
				}
			}
		>(true)

		assert.isEqualDeep(publicPerson, {
			id: 'person-with-all-fields',
			name: 'Person (all fields)',
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
	}
}
