import { test, assert } from '@sprucelabs/test'
import { errorAssertUtil } from '@sprucelabs/test-utils'
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
			label: 'First name',
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
	id: 'personWithFavColors',
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
		age: {
			type: 'number',
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
	id: 'personWithFavToolsOrFruit',
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
	id: 'versionedPersonWithFavToolsOrFruit',
	name: 'Person with favorite tools',
	fields: {
		firstName: {
			type: 'text',
			label: 'First name',
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

	private static validateOptions = { shouldMapToParameterErrors: false }

	@test()
	protected static async canValidateBasicSchemaValues() {
		const err = assert.doesThrow(
			() => validateSchemaValues(personSchema, {}, this.validateOptions),
			/'First name' is required/gi
		)

		assert.isEqual(err.message.substr(0, 12), '3 errors for')
	}

	@test()
	protected static async canValidateSchemaWithArrayValues() {
		assert.doesThrow(
			() =>
				validateSchemaValues(
					personWithFavColorsSchema,
					{
						firstName: 'tay',
						lastName: 'ro',
					},
					this.validateOptions
				),
			/'favoriteColors' is required/gi
		)
	}

	@test()
	protected static async typesValidatedValues() {
		const values = {
			firstName: 'Bob',
			lastName: 'Bob',
			profileImages: {
				profile60: '@',
				profile150: '@',
				'profile60@2x': '@',
				'profile150@2x': '@',
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
				profile60: '@',
				profile150: '@',
				'profile60@2x': '@',
				'profile150@2x': '@',
			},
		}

		validateSchemaValues(personSchema, person)
	}

	@test()
	protected static async failsWithBadSchema() {
		assert.doesThrow(
			//@ts-ignore
			() => validateSchemaValues(null, {}),
			/Invalid schema/
		)
	}

	@test()
	protected static async failsWhenValidatingFieldsNotOnSchema() {
		const err = assert.doesThrow(
			() =>
				validateSchemaValues(
					personSchema,
					{
						taco: 'bravo',
						firstName: 'first',
						lastName: 'last',
						profileImages: {
							profile60: '@',
							profile150: '@',
							'profile60@2x': '@',
							'profile150@2x': '@',
						},
					},
					this.validateOptions
				),
			/is not a field on/
		) as SpruceError

		errorAssertUtil.assertError(err, 'INVALID_FIELD', {
			'errors[0].code': 'unexpected',
		})
	}

	@test()
	protected static async givesInvalidFieldErrorWhenValidatingEmptyArrayNestedSchemas() {
		const err = assert.doesThrow(
			() =>
				validateSchemaValues(
					personWithFavToolsSchema,
					{
						firstName: 'first',
						lastName: 'last',
						favoriteTools: [],
					},
					this.validateOptions
				),
			/'favoriteTools' is required/
		) as SpruceError

		errorAssertUtil.assertError(err, 'INVALID_FIELD', {
			'errors[].code': 'missing_required',
		})
	}

	@test()
	protected static async givesInvalidFieldErrorWhenValidatingNestedSchemas() {
		const err = assert.doesThrow(
			() =>
				validateSchemaValues(
					personWithFavToolsSchema,
					{
						firstName: 'first',
						lastName: 'last',
						//@ts-ignore
						favoriteTools: [{}],
					},
					this.validateOptions
				),
			/'name' is required/
		) as SpruceError

		errorAssertUtil.assertError(err, 'INVALID_FIELD', {
			errors: [{ code: 'invalid_related_schema_values' }],
		})
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
				validateSchemaValues(
					personWithFavToolsOrFruitSchema,
					{
						firstName: 'Ryan',
						favoriteToolsOrFruit: [],
					},
					this.validateOptions
				),
			/'favoriteToolsOrFruit' is required/gi
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
						age: 10,
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

	@test()
	protected static async canValidateArrayOfVersionedUnionValuesAndThrowsReallyHelpfulError() {
		/*Const err =*/
		assert.doesThrow(() =>
			validateSchemaValues(
				versionedPersonWithFavToolsOrFruitSchema,
				{
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
								size: 'wrench',
							},
						},
						{
							schemaId: 'versionedTool',
							version: '2.0',
							values: {
								name: 'wrench',
							},
						},
					],
				},
				this.validateOptions
			)
		) as SpruceError

		// NOTE uncomment here and above to see error output
		// const message = err.friendlyMessage()
		// console.log(message)
		// debugger
	}

	@test()
	protected static throwsWhenAddingExtraFieldAtTopLevel() {
		assert.doesThrow(
			() =>
				validateSchemaValues(
					personWithFavToolsOrFruitSchema,
					{
						firstName: 'Ryan',
						doesNotExist: true,
						favoriteToolsOrFruit: [
							{
								schemaId: 'fruit',
								values: {
									color: 'green',
								},
							},
						],
					},
					this.validateOptions
				),
			/doesNotExist/
		)
	}

	@test()
	protected static throwsWhenAddingExtraFieldInNestedSchema() {
		assert.doesThrow(
			() =>
				validateSchemaValues(
					personWithFavToolsOrFruitSchema,
					{
						firstName: 'Ryan',
						favoriteToolsOrFruit: [
							{
								schemaId: 'fruit',
								values: {
									doesNotExist: true,
									color: 'green',
								},
							},
						],
					},
					this.validateOptions
				),
			/doesNotExist/
		)
	}

	@test()
	protected static mapsToParameterErrorsByDefault() {
		const err = assert.doesThrow(() =>
			validateSchemaValues(personWithFavToolsOrFruitSchema, {
				firstName: 'Ryan',
				favoriteToolsOrFruit: [],
			})
		)

		errorAssertUtil.assertError(err, 'VALIDATION_FAILED')

		//@ts-ignore
		assert.isLength(err.options.errors, 1)

		//@ts-ignore
		errorAssertUtil.assertError(err.options.errors[0], 'MISSING_PARAMETERS', {
			parameters: ['favoriteToolsOrFruit'],
		})
	}

	@test('validation errors are typed (will always pass, lint will fail)')
	protected static validationErrorsAreTyped() {
		try {
			validateSchemaValues(personWithFavToolsOrFruitSchema, {
				firstName: 'Ryan',
				favoriteToolsOrFruit: [],
			})
		} catch (err) {
			if (err instanceof SpruceError) {
				if (err.options.code === 'VALIDATION_FAILED') {
					const first = err.options.errors[0].options.code
					assert.isExactType<
						typeof first,
						| 'MISSING_PARAMETERS'
						| 'INVALID_PARAMETERS'
						| 'UNEXPECTED_PARAMETERS'
					>(true)
				}
			} else {
				assert.fail('Bad error returned')
			}
		}
	}
}
