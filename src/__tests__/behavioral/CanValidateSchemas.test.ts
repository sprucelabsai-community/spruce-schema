import { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import SchemaEntity, { normalizeSchemaValues } from '../..'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import SpruceError from '../../errors/SpruceError'
import {
	ISchema,
	ISchemaGetValuesOptions,
	SchemaValues,
} from '../../schemas.static.types'
import areSchemaValuesValid from '../../utilities/areSchemaValuesValid'
import buildSchema from '../../utilities/buildSchema'
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

const dynamicSchema = buildSchema({
	id: 'dynamicSchema',
	name: 'dynamic schema',
	dynamicFieldSignature: {
		type: FieldType.Text,
		keyName: 'anything',
	},
})

const personSchema = buildSchema({
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

const personWithFavColors = buildSchema({
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

type PersonWithFavColorSchema = typeof personWithFavColors
type PersonWithFavColorValues = SchemaValues<PersonWithFavColorSchema>

class TestWithSchemas<
	Schema extends ISchema,
	Values extends SchemaValues<Schema> = SchemaValues<Schema>
> {
	public schema: Schema

	public constructor(schema: Schema) {
		this.schema = schema
	}

	public validate(values: Values, options?: ISchemaGetValuesOptions<Schema>) {
		validateSchemaValues(this.schema, values, options)
	}

	public normalize(
		values: Values,
		options?: { includePrivateFields: boolean }
	) {
		return normalizeSchemaValues(this.schema, values, options)
	}
}

export default class CanValidateSchemasTest extends AbstractSchemaTest {
	protected static async beforeEach() {
		await super.beforeEach()
	}

	@test()
	protected static async canValidateBasicSchema() {
		assert.doesThrow(
			() => validateSchemaValues(personSchema, {}),
			/firstName is required/gi
		)
	}

	@test()
	protected static async canValidateSchemaWithArrayValues() {
		assert.doesThrow(
			() =>
				validateSchemaValues(personWithFavColors, {
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
		validateSchemaValues(personSchema, values)
		assert.isType<SchemaValues<typeof personSchema>>(values)
		assert.isType<string | undefined | null>(values.email)
	}

	@test()
	protected static async canValidateSpecificFields() {
		const err = assert.doesThrow(() =>
			validateSchemaValues(personSchema, {}, { fields: ['firstName'] })
		)

		assert.doesNotInclude(err.message, /lastName/gi)
	}

	@test()
	protected static async canCheckValidityWithoutThrowing() {
		const isValid = areSchemaValuesValid(personSchema, {})
		assert.isFalse(isValid)
	}

	@test()
	protected static async canCheckValidityOnDynamicFieldsWithoutThrowing() {
		const isValid = SchemaEntity.isSchemaValid(dynamicSchema)
		assert.isTrue(isValid)
	}

	@test()
	protected static async canCheckValidityOnSpecificFields() {
		const isValid = areSchemaValuesValid(
			personSchema,
			{ firstName: 'test' },
			{ fields: ['firstName'] }
		)
		assert.isTrue(isValid)
	}

	@test()
	protected static async failsOnSpecificFields() {
		const isValid = areSchemaValuesValid(
			personSchema,
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

		validateSchemaValues(personSchema, person)
	}

	@test()
	protected static async failsWithBadSchema() {
		assert.doesThrow(
			//@ts-ignore
			() => validateSchemaValues(null, {}),
			/INVALID_SCHEMA_DEFINITION/
		)
	}

	@test()
	protected static async typeTesting() {
		function test(values: PersonWithFavColorValues) {
			validateSchemaValues(personWithFavColors, values)
		}

		const validValues = {
			firstName: 'first',
			lastName: 'last',
			favoriteColors: ['green'],
		}

		test(validValues)

		const testInstance = new TestWithSchemas(personWithFavColors)
		testInstance.validate(validValues)
		assert.isEqualDeep(
			testInstance.normalize(validValues, { includePrivateFields: false }),
			validValues
		)
	}

	@test()
	protected static async failsWhenValidatingFieldsNotOnSchema() {
		const err = assert.doesThrow(
			//@ts-ignore
			() =>
				validateSchemaValues(personSchema, {
					taco: 'bravo',
					firstName: 'first',
					lastName: 'last',
					profileImages: {
						profile60: '',
						profile150: '',
						'profile60@2x': '',
						'profile150@2x': '',
					},
				}),
			/FIELD_NOT_FOUND/
		) as SpruceError

		if (err.options.code === 'FIELD_NOT_FOUND') {
			assert.isEqual(err.options.fields[0], 'taco')
		} else {
			assert.fail(`Expected FIELD_NOT_FOUND but got ${err.options.code}`)
		}
	}
}
