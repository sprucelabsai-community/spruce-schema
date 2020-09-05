import { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { buildSchema } from '../..'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import dropFields from '../../utilities/dropFields'
import dropPrivateFields from '../../utilities/dropPrivateFields'

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
		privateField: {
			type: FieldType.Text,
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
			builder: 'buildSchema',
			fields: {
				lastName: {
					type: FieldType.Text,
					isRequired: true,
				},
				privateField: {
					type: FieldType.Text,
					isPrivate: true,
				},
			},
		})

		assert.isExactType<
			typeof optionalPerson,
			{
				id: string
				name: string
				builder: 'buildSchema'
				fields: {
					lastName: {
						type: FieldType.Text
						isRequired: true
					}
					privateField: {
						type: FieldType.Text
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
				builder: 'buildSchema'
				fields: {
					firstName: {
						type: FieldType.Text
						isRequired: true
					}
					lastName: {
						type: FieldType.Text
						isRequired: true
					}
				}
			}
		>(true)

		assert.isEqualDeep(publicPerson, {
			id: 'person-with-all-fields',
			name: 'Person (all fields)',
			builder: 'buildSchema',
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
	}
}
