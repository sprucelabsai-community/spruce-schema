import { test, assert } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import SpruceError from '../../errors/SpruceError'
import { SchemaValues } from '../../schemas.static.types'
import areSchemaValuesValid from '../../utilities/areSchemaValuesValid'
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
			type: 'text',
			isRequired: true,
		},
		profile150: {
			label: '150x150',
			type: 'text',
			isRequired: true,
		},
		'profile60@2x': {
			label: '60x60',
			type: 'text',
			isRequired: true,
		},
		'profile150@2x': {
			label: '150x150',
			type: 'text',
			isRequired: true,
		},
	},
})

const dynamicSchema = buildSchema({
	id: 'dynamicSchema',
	name: 'dynamic schema',
	dynamicFieldSignature: {
		type: 'text',
		keyName: 'anything',
	},
})

const personSchema = buildSchema({
	id: 'testPerson',
	name: 'A test person',
	fields: {
		firstName: {
			type: 'text',
			isRequired: true,
		},
		lastName: {
			type: 'text',
			isRequired: true,
		},
		email: {
			type: 'text',
			isRequired: false,
		},
		profileImages: {
			isRequired: true,
			type: 'schema',
			options: {
				schema: profileImagesSchema,
			},
		},
	},
})

const personWithFavColorsSchema = buildSchema({
	id: 'testPerson',
	fields: {
		firstName: {
			type: 'text',
			isRequired: true,
		},
		lastName: {
			type: 'text',
			isRequired: true,
		},
		favoriteColors: {
			type: 'text',
			isArray: true,
			isRequired: true,
		},
	},
})

const toolSchema = buildSchema({
	id: 'tool',
	fields: {
		name: {
			type: 'text',
			isRequired: true,
		},
	},
})

const fruitSchema = buildSchema({
	id: 'fruit',
	fields: {
		color: {
			type: 'select',
			isRequired: true,
			options: {
				choices: [
					{
						value: 'yellow',
						label: 'Yellow',
					},
					{
						value: 'green',
						label: 'Green',
					},
				],
			},
		},
	},
})

const versionedToolSchema = buildSchema({
	id: 'versionedTool',
	version: '1.0',
	fields: {
		name: {
			type: 'text',
			isRequired: true,
		},
	},
})

const version2ToolSchema = buildSchema({
	id: 'versionedTool',
	version: '2.0',
	fields: {
		size: {
			type: 'text',
			isRequired: true,
		},
	},
})

const versionedFruitSchema = buildSchema({
	id: 'versionedFruit',
	version: '1.0',
	fields: {
		color: {
			type: 'select',
			isRequired: true,
			options: {
				choices: [
					{
						value: 'yellow',
						label: 'Yellow',
					},
					{
						value: 'green',
						label: 'Green',
					},
				],
			},
		},
	},
})

const personWithFavToolsSchema = buildSchema({
	id: 'personWithFavTools',
	name: 'Person with favorite tools',
	fields: {
		firstName: {
			type: 'text',
			isRequired: true,
		},
		lastName: {
			type: 'text',
		},
		favoriteTools: {
			isRequired: true,
			type: 'schema',
			isArray: true,
			options: {
				schema: toolSchema,
			},
		},
	},
})

const personWithFavToolsOrFruitSchema = buildSchema({
	id: 'personWithFavTools',
	name: 'Person with favorite tools',
	fields: {
		firstName: {
			type: 'text',
			isRequired: true,
		},
		lastName: {
			type: 'text',
		},
		favoriteToolsOrFruit: {
			isRequired: true,
			type: 'schema',
			isArray: true,
			options: {
				schemas: [toolSchema, fruitSchema],
			},
		},
	},
})

const versionedPersonWithFavToolsOrFruitSchema = buildSchema({
	id: 'versionedPersonWithFavTools',
	name: 'Person with favorite tools',
	fields: {
		firstName: {
			type: 'text',
			isRequired: true,
		},
		lastName: {
			type: 'text',
		},
		favoriteToolsOrFruit: {
			isRequired: true,
			type: 'schema',
			isArray: true,
			options: {
				schemas: [
					versionedFruitSchema,
					versionedToolSchema,
					version2ToolSchema,
				],
			},
		},
	},
})

export default class CanValidateSchemasTest extends AbstractSchemaTest {
	protected static async beforeEach() {
		await super.beforeEach()
	}

	@test()
	protected static async canValidateBasicSchemaValues() {
		const err = assert.doesThrow(
			() => validateSchemaValues(personSchema, {}),
			/firstName is required/gi
		)

		assert.isEqual(err.message.substr(0, 14), 'INVALID_FIELD:')
	}

	@test()
	protected static async canValidateSchemaWithArrayValues() {
		assert.doesThrow(
			() =>
				validateSchemaValues(personWithFavColorsSchema, {
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
		const isValid = isSchemaValid(dynamicSchema)
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
	protected static async failsWhenValidatingFieldsNotOnSchema() {
		const err = assert.doesThrow(
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

	@test()
	protected static async givesInvalidFieldErrorWhenValidatingEmptyArrayNestedSchemas() {
		const err = assert.doesThrow(
			() =>
				validateSchemaValues(personWithFavToolsSchema, {
					firstName: 'first',
					lastName: 'last',
					favoriteTools: [],
				}),
			/INVALID_FIELD/
		) as SpruceError

		if (err.options.code === 'INVALID_FIELD') {
			assert.isLength(err.options.errors, 1)
			assert.isEqual(err.options.errors[0].code, 'missing_required')
		} else {
			assert.fail(`Expected INVALID_FIELD but got ${err.options.code}`)
		}
	}

	@test()
	protected static async givesInvalidFieldErrorWhenValidatingNestedSchemas() {
		const err = assert.doesThrow(
			() =>
				validateSchemaValues(personWithFavToolsSchema, {
					firstName: 'first',
					lastName: 'last',
					favoriteTools: [
						{
							//@ts-ignore
							foo: 'bar',
						},
					],
				}),
			/INVALID_FIELD/
		) as SpruceError

		if (err.options.code === 'INVALID_FIELD') {
			assert.isLength(err.options.errors, 1)
			assert.isEqual(
				err.options.errors[0].code,
				'invalid_related_schema_values'
			)
			assert.isEqual(
				err.options.errors[0].error?.message.substr(0, 14),
				'INVALID_FIELD:'
			)
		} else {
			assert.fail(`Expected INVALID_FIELD but got ${err.options.code}`)
		}
	}

	@test()
	protected static async canValidateNestedArraySchema() {
		validateSchemaValues(personWithFavToolsSchema, {
			firstName: 'Tay',
			favoriteTools: [
				{
					name: 'Laptop',
				},
			],
		})
	}

	@test()
	protected static async canValidateArrayOfUnionValuesMissingRequired() {
		assert.doesThrow(
			() =>
				validateSchemaValues(personWithFavToolsOrFruitSchema, {
					firstName: 'Ryan',
					favoriteToolsOrFruit: [],
				}),
			/favoriteToolsOrFruit is required/gi
		)
	}

	@test()
	protected static async canValidateArrayOfUnionValues() {
		validateSchemaValues(personWithFavToolsOrFruitSchema, {
			firstName: 'Ryan',
			favoriteToolsOrFruit: [
				{
					schemaId: 'fruit',
					values: {
						color: 'green',
					},
				},
				{
					schemaId: 'fruit',
					values: {
						color: 'yellow',
					},
				},
				{
					schemaId: 'tool',
					values: {
						name: 'wrench',
					},
				},
			],
		})
	}

	@test()
	protected static async canValidateArrayOfVersionedUnionValues() {
		validateSchemaValues(versionedPersonWithFavToolsOrFruitSchema, {
			firstName: 'Ryan',
			favoriteToolsOrFruit: [
				{
					schemaId: 'versionedFruit',
					version: '1.0',
					values: {
						color: 'green',
					},
				},
				{
					schemaId: 'versionedFruit',
					version: '1.0',
					values: {
						color: 'yellow',
					},
				},
				{
					schemaId: 'versionedTool',
					version: '1.0',
					values: {
						name: 'wrench',
					},
				},
				{
					schemaId: 'versionedTool',
					version: '2.0',
					values: {
						size: 'wrench',
					},
				},
			],
		})
	}
}
