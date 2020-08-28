import { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import { SchemaValues } from '../../schemas.static.types'
import buildSchema from '../../utilities/buildSchema'
import isSchemaValid from '../../utilities/isSchemaValid'
import validateSchemaValues from '../../utilities/validateSchemaValues'

const profileImagesSchema = buildSchema({
	id: 'profileImage',
	name: 'Profile Image Sizes',
	description: 'Various sizes that a profile image comes in.',
	fields: {
		profile60: {
			label: '60x60',
			type: FieldType.Text,
			isRequired: true,
		},
		profile150: {
			label: '150x150',
			type: FieldType.Text,
			isRequired: true,
		},
		'profile60@2x': {
			label: '60x60',
			type: FieldType.Text,
			isRequired: true,
		},
		'profile150@2x': {
			label: '150x150',
			type: FieldType.Text,
			isRequired: true,
		},
	},
})

export default class CanValidateSchemasTest extends AbstractSchemaTest {
	private static personSchema = buildSchema({
		id: 'testPerson',
		name: 'A test person',
		fields: {
			firstName: {
				type: FieldType.Text,
				isRequired: true,
			},
			lastName: {
				type: FieldType.Text,
				isRequired: true,
			},
			email: {
				type: FieldType.Text,
				isRequired: false,
			},
			profileImages: {
				isRequired: true,
				type: FieldType.Schema,
				options: {
					schema: profileImagesSchema,
				},
			},
		},
	})

	private static personWithFavColors = buildSchema({
		id: 'testPerson',
		name: 'A test person',
		fields: {
			firstName: {
				type: FieldType.Text,
				isRequired: true,
			},
			lastName: {
				type: FieldType.Text,
				isRequired: true,
			},
			favoriteColors: {
				type: FieldType.Text,
				isArray: true,
				isRequired: true,
			},
		},
	})

	protected static async beforeEach() {
		await super.beforeEach()
	}

	@test()
	protected static async canValidateBasicSchema() {
		assert.doesThrow(
			() => validateSchemaValues(this.personSchema, {}),
			/firstName is required/gi
		)
	}

	@test()
	protected static async canValidateSchemaWithArrayValues() {
		assert.doesThrow(
			() =>
				validateSchemaValues(this.personWithFavColors, {
					firstName: 'tay',
					lastName: 'ro',
				}),
			/favoriteColors is required/gi
		)
	}

	@test()
	protected static async typesValidatedValues() {
		const values = {
			firstName: 'Bob',
			lastName: 'Bob',
			profileImages: {
				profile60: '',
				profile150: '',
				'profile60@2x': '',
				'profile150@2x': '',
			},
		}
		validateSchemaValues(this.personSchema, values)
		const personSchema = this.personSchema
		assert.isType<SchemaValues<typeof personSchema>>(values)
		assert.isType<string | undefined | null>(values.email)
	}

	@test()
	protected static async canValidateSpecificFields() {
		const err = assert.doesThrow(() =>
			validateSchemaValues(this.personSchema, {}, { fields: ['firstName'] })
		)

		assert.doesNotInclude(err.message, /lastName/gi)
	}

	@test()
	protected static async canCheckValidityWithoutThrowing() {
		const isValid = isSchemaValid(this.personSchema, {})
		assert.isFalse(isValid)
	}

	@test()
	protected static async canCheckValidityOnSpecificFields() {
		const isValid = isSchemaValid(
			this.personSchema,
			{ firstName: 'test' },
			{ fields: ['firstName'] }
		)
		assert.isTrue(isValid)
	}

	@test()
	protected static async failsOnSpecificFields() {
		const isValid = isSchemaValid(
			this.personSchema,
			{ firstName: 'test' },
			{ fields: ['lastName'] }
		)
		assert.isFalse(isValid)
	}

	@test()
	protected static async passesWithValidPerson() {
		const person = {
			firstName: 'firstName',
			lastName: 'lastName',
			profileImages: {
				profile60: '',
				profile150: '',
				'profile60@2x': '',
				'profile150@2x': '',
			},
		}

		validateSchemaValues(this.personSchema, person)
	}

	@test()
	protected static async failsWithBadSchema() {
		assert.doesThrow(
			//@ts-ignore
			() => validateSchemaValues(null, {}),
			/INVALID_SCHEMA_DEFINITION/
		)
	}
}
