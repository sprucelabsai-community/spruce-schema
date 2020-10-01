import { test, assert } from '@sprucelabs/test'
import { errorAssertUtil } from '@sprucelabs/test-utils'
import { unset } from 'lodash'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import SpruceError from '../../errors/SpruceError'
import SchemaEntity from '../../SchemaEntity'
import {
	SchemaValues,
	ISchemaEntity,
	ISchema,
} from '../../schemas.static.types'
import buildSchema from '../../utilities/buildSchema'
import isSchemaValid from '../../utilities/isSchemaValid'
import validateSchema from '../../utilities/validateSchema'
import buildPersonWithCars, {
	ICarSchema,
	ITruckSchema,
	IPersonSchema,
} from '../data/personWithCars'

SchemaEntity.enableDuplicateCheckWhenTracking = false

type IPersonMappedValues = SchemaValues<IPersonSchema, true>

interface IPersonExpectedValues {
	optionalSelectWithDefaultValue?: 'hello' | 'goodbye' | null
	optionalTextWithDefaultValue?: string | null
	optionalIsArrayCarOrTruckWithDefaultValue?:
		| (ISchemaEntity<ICarSchema> | ISchemaEntity<ITruckSchema>)[]
		| null
	optionalCarOrTruckWithDefaultValue?:
		| ISchemaEntity<ICarSchema>
		| ISchemaEntity<ITruckSchema>
		| null
}

interface IPersonExpectedValuesWithoutSchema {
	optionalSelectWithDefaultValue?: 'hello' | 'goodbye' | null
	optionalTextWithDefaultValue?: string | null
	optionalIsArrayCarOrTruckWithDefaultValue?:
		| {
				schemaId: 'car' | 'truck'
				values: SchemaValues<ICarSchema> | SchemaValues<ITruckSchema>
		  }[]
		| null
	optionalCarOrTruckWithDefaultValue?: {
		schemaId: 'car' | 'truck'
		values: SchemaValues<ICarSchema> | SchemaValues<ITruckSchema>
	} | null
}

const { personSchema, truckSchema } = buildPersonWithCars()

const nestedSchemas = buildSchema({
	id: 'contract',
	name: 'contract',
	fields: {
		requiredArrayField: {
			type: 'schema',
			isArray: true,
			isRequired: true,
			options: {
				schema: {
					id: 'nested',
					name: 'Nested',
					fields: {
						fieldOnNested: {
							type: 'text',
							isRequired: true,
						},
					},
				},
			},
		},
	},
})

const nestedSingleRequiredFieldSchemas = buildSchema({
	id: 'singleRequiredField',
	name: 'single required field',
	fields: {
		contract: {
			type: 'schema',
			isRequired: true,
			options: {
				schema: nestedSchemas,
			},
		},
	},
})

export default class SchemaTest extends AbstractSchemaTest {
	@test()
	protected static async testBasicValidation() {
		const schema = {
			id: 'simple-test',
			name: 'Simple Test Schema',
		}

		assert.isFalse(
			isSchemaValid(schema),
			'Bad definition incorrectly passed valid check'
		)
	}

	@test('Catches missing id', 'id', ['id_missing'])
	@test('Catches missing fields', 'fields', [
		'needs_fields_or_dynamic_field_signature',
	])
	protected static async testMissingKeys(
		fieldToDelete: string,
		expectedErrors: string[]
	) {
		const schema = buildSchema({
			id: 'missing-fields',
			name: 'missing name',
			fields: {
				firstName: {
					type: 'text',
				},
				lastName: {
					type: 'text',
				},
			},
		})

		unset(schema, fieldToDelete)

		const error: any = assert.doesThrow(() =>
			validateSchema(schema)
		) as SpruceError

		errorAssertUtil.assertError(error, 'INVALID_SCHEMA', {
			errors: expectedErrors,
		})
	}

	@test(
		'Does isArray make value an array (test always passes, linting should fail if broken)'
	)
	protected static async canIsArrayValue() {
		const schema = buildSchema({
			id: 'is-array-test',
			name: 'is array',
			fields: {
				name: {
					type: 'text',
					label: 'Name',
					value: 'Tay',
				},
				nicknames: {
					type: 'text',
					label: 'Nick names',
					isArray: true,
					value: ['Tay', 'Taylor'],
				},
				anotherName: {
					type: 'number',
					label: 'Favorite numbers',
					isArray: true,
					value: [10, 5, 5],
				},
				schemaField: {
					type: 'schema',
					label: 'Favorite numbers',
					isArray: true,
					options: {
						schema: {
							id: 'nested',
							name: 'Nested',
							fields: {},
						},
					},
				},
			},
		})

		assert.isTrue(isSchemaValid(schema))
	}

	@test()
	protected static getSetArrays() {
		const entity = new SchemaEntity({
			id: 'missing-fields',
			name: 'missing name',
			fields: {
				name: {
					type: 'text',
					isArray: false,
					value: 'tay',
				},
				favoriteColors: {
					type: 'text',
					isArray: true,
					value: ['black'],
				},
			},
		})

		let values = entity.getValues({ fields: ['name'] })
		assert.isEqual(values.name, 'tay')
		assert.isUndefined(
			//@ts-ignore
			values.favoriteColors,
			'getValues did not filter by fields'
		)

		entity.set('favoriteColors', ['test'])
		assert.isEqualDeep(
			entity.get('favoriteColors'),
			['test'],
			'Did not set value correctly'
		)

		// @ts-ignore
		entity.set('favoriteColors', 'test2')
		assert.isEqualDeep(
			entity.get('favoriteColors'),
			['test2'],
			'Did not set value correctly'
		)

		entity.set('name', 'Taylor')
		assert.isEqualDeep(entity.getValues(), {
			name: 'Taylor',
			favoriteColors: ['test2'],
		})

		// @ts-ignore
		entity.setValues({ name: ['becca'], favoriteColors: 'blue' })
		const name = entity.get('name')
		assert.isEqual(name, 'becca')

		const colors = entity.get('favoriteColors')
		assert.isTrue(
			Array.isArray(colors),
			'Getter did not transform colors into array'
		)
	}

	@test()
	protected static testTransformingValuesToValueTypes() {
		const schema = new SchemaEntity({
			id: 'is-array-transform',
			name: 'transform tests',
			fields: {
				name: {
					type: 'text',
					isArray: false,
					value: 'tay',
				},
				favoriteColors: {
					type: 'text',
					isArray: true,
					value: ['blue'],
				},
				favoriteNumber: {
					type: 'number',
				},
			},
		})

		// @ts-ignore
		schema.set('favoriteColors', [1, 2, 3])

		const favColors = schema.get('favoriteColors')
		assert.isEqualDeep(favColors, ['1', '2', '3'])

		// @ts-ignore
		schema.set('favoriteNumber', ['9', '8', '100'])
		const favNumber = schema.get('favoriteNumber')
		assert.isEqual(
			favNumber,
			9,
			'Schema did not transform array of strings to single number'
		)
	}

	@test()
	protected static testValuesTypesAgainstObjectLiteral() {
		const values: {
			name: string
			onlyOnCar: string | undefined | null
		} = {
			name: 'test',
			onlyOnCar: null,
		}
		assert.isType<SchemaValues<typeof truckSchema>>(values)
	}

	@test()
	protected static testFullValuesTypes() {
		const personEntity = new SchemaEntity(personSchema)
		const values = personEntity.getValues({ validate: false })
		const valuesWithoutInstances = personEntity.getValues({
			validate: false,
			createEntityInstances: false,
		})
		assert.isType<IPersonExpectedValues>(values)
		assert.isType<IPersonMappedValues>(values)
		assert.isType<IPersonExpectedValuesWithoutSchema>(valuesWithoutInstances)
	}

	@test()
	protected static testGettingOptionsByField() {
		const entity = new SchemaEntity(personSchema)
		entity.set('name', 'a really long name that should get truncated')
		const name = entity.get('name', { byField: { name: { maxLength: 10 } } })
		assert.isEqual(name, 'a really l')
	}

	@test()
	protected static canCorrectlyTypeSchemaWithOneRequiredField() {
		const values: SchemaValues<typeof nestedSingleRequiredFieldSchemas> = {
			contract: {
				requiredArrayField: [],
			},
		}

		const {
			contract: { requiredArrayField },
		} = values

		function testFunc(_options: { fieldOnNested: string }) {}

		testFunc(requiredArrayField[0])

		assert.isExactType<typeof requiredArrayField[0], { fieldOnNested: string }>(
			true
		)
	}

	@test()
	protected static testGenerics() {
		interface GenericTestInterface<S extends ISchema = ISchema> {
			payloadSchema: S
			callback: (payload: SchemaValues<S>) => void
		}

		const testObj: GenericTestInterface<typeof nestedSingleRequiredFieldSchemas> = {
			payloadSchema: nestedSingleRequiredFieldSchemas,
			callback: (payload) => {
				const { requiredArrayField } = payload.contract
				const mappedArray = requiredArrayField.map((item) => item.fieldOnNested)
				assert.isExactType<typeof mappedArray, string[]>(true)
			},
		}

		assert.isTruthy(testObj)
	}
}
