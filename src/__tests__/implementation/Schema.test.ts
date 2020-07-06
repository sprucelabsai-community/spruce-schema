import BaseTest, { test, assert } from '@sprucelabs/test'
import { unset } from 'lodash'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { ErrorCode } from '../../errors/error.types'
import SpruceError from '../../errors/SpruceError'
import Schema from '../../Schema'
import { SchemaDefinitionValues, ISchema } from '../../schemas.static.types'
import buildSchemaDefinition from '../../utilities/buildSchemaDefinition'
import buildPersonWithCars, {
	ICarDefinition,
	ITruckDefinition,
	IPersonDefinition,
} from '../data/personWithCars'

Schema.enableDuplicateCheckWhenTracking = false

type IPersonMappedValues = SchemaDefinitionValues<IPersonDefinition, true>

interface IPersonExpectedValues {
	optionalSelectWithDefaultValue?: 'hello' | 'goodbye' | null
	optionalTextWithDefaultValue?: string | null
	optionalIsArrayCarOrTruckWithDefaultValue?:
		| (ISchema<ICarDefinition> | ISchema<ITruckDefinition>)[]
		| null
	optionalCarOrTruckWithDefaultValue?:
		| ISchema<ICarDefinition>
		| ISchema<ITruckDefinition>
		| null
}

interface IPersonExpectedValuesWithoutSchema {
	optionalSelectWithDefaultValue?: 'hello' | 'goodbye' | null
	optionalTextWithDefaultValue?: string | null
	optionalIsArrayCarOrTruckWithDefaultValue?:
		| {
				schemaId: 'car' | 'truck'
				values:
					| SchemaDefinitionValues<ICarDefinition>
					| SchemaDefinitionValues<ITruckDefinition>
		  }[]
		| null
	optionalCarOrTruckWithDefaultValue?: {
		schemaId: 'car' | 'truck'
		values:
			| SchemaDefinitionValues<ICarDefinition>
			| SchemaDefinitionValues<ITruckDefinition>
	} | null
}

const { personDefinition, truckDefinition } = buildPersonWithCars()

export default class SchemaTest extends BaseTest {
	@test('Can do basic definition validation')
	protected static async testBasicValidation() {
		const definition = {
			id: 'simple-test',
			name: 'Simple Test Schema',
		}

		assert.isFalse(
			Schema.isDefinitionValid(definition),
			'Bad definition incorrectly passed valid check'
		)
	}

	@test('Catches missing id', 'id', ['id_missing'])
	@test('Catches missing name', 'name', ['name_missing'])
	@test('Catches missing fields', 'fields', [
		'needs_fields_or_dynamic_key_signature',
	])
	protected static async testMissingKeys(
		fieldToDelete: string,
		expectedErrors: string[]
	) {
		const definition = buildSchemaDefinition({
			id: 'missing-fields',
			name: 'missing name',
			fields: {
				firstName: {
					type: FieldType.Text,
				},
				lastName: {
					type: FieldType.Text,
				},
			},
		})

		unset(definition, fieldToDelete)

		const error: any = assert.doesThrow(() =>
			Schema.validateDefinition(definition)
		)

		if (
			error instanceof SpruceError &&
			error.options.code === ErrorCode.InvalidSchemaDefinition
		) {
			const {
				options: { errors },
			} = error

			assert.isEqualDeep(
				errors,
				expectedErrors,
				'Did not get back the error I expected'
			)
		} else {
			assert.fail('Schema.validateDefinition should return a SpruceError')
		}
	}

	@test(
		'Does isArray make value an array (test always passes, linting should fail if broken)'
	)
	protected static async canIsArrayValue() {
		const definition = buildSchemaDefinition({
			id: 'is-array-test',
			name: 'is array',
			fields: {
				name: {
					type: FieldType.Text,
					label: 'Name',
					value: 'Tay',
				},
				nicknames: {
					type: FieldType.Text,
					label: 'Nick names',
					isArray: true,
					value: ['Tay', 'Taylor'],
				},
				anotherName: {
					type: FieldType.Number,
					label: 'Favorite numbers',
					isArray: true,
					value: [10, 5, 5],
				},
			},
		})

		assert.isTrue(Schema.isDefinitionValid(definition))
	}

	@test('isArray get/set work and transform to/from array')
	protected static testGetSet() {
		const schema = new Schema({
			id: 'missing-fields',
			name: 'missing name',
			fields: {
				name: {
					type: FieldType.Text,
					isArray: false,
					value: 'tay',
				},
				favoriteColors: {
					type: FieldType.Text,
					isArray: true,
					value: ['black'],
				},
			},
		})

		const values = schema.getValues({ fields: ['name'] })
		assert.isEqual(values.name, 'tay')
		assert.isUndefined(
			//@ts-ignore
			values.favoriteColors,
			'getValues did not filter by fields'
		)

		// Try setting favorite colors
		schema.set('favoriteColors', ['test'])
		assert.isEqualDeep(
			schema.values.favoriteColors,
			['test'],
			'Did not set value correctly'
		)

		// Try setting favorite color wrong, but should be coerced back to an array
		// @ts-ignore
		schema.set('favoriteColors', 'test2')
		assert.isEqualDeep(
			schema.values.favoriteColors,
			['test2'],
			'Did not set value correctly'
		)

		// Check non array values too
		schema.set('name', 'Taylor')
		assert.isEqualDeep(schema.values, {
			name: 'Taylor',
			favoriteColors: ['test2'],
		})

		// Make sure getters work
		// @ts-ignore
		schema.values = { name: ['becca'], favoriteColors: 'blue' }
		const name = schema.get('name')
		assert.isEqual(name, 'becca')

		const colors = schema.get('favoriteColors')
		assert.isTrue(
			Array.isArray(colors),
			'Getter did not transform colors into array'
		)
	}

	@test('Can transform isArray values')
	protected static testTransformingValues() {
		const schema = new Schema({
			id: 'is-array-transform',
			name: 'transform tests',
			fields: {
				name: {
					type: FieldType.Text,
					isArray: false,
					value: 'tay',
				},
				favoriteColors: {
					type: FieldType.Text,
					isArray: true,
					value: ['blue'],
				},
				favoriteNumber: {
					type: FieldType.Number,
				},
			},
		})

		// Set favorite color to a bunch of numbers and make sure it comes back a bunch of strings
		// @ts-ignore
		schema.values.favoriteColors = [1, 2, 3]

		const favColors = schema.get('favoriteColors')
		assert.isEqualDeep(favColors, ['1', '2', '3'])

		// Opposite test
		// @ts-ignore
		schema.values.favoriteNumber = ['7', '8', '100']
		const favNumber = schema.get('favoriteNumber')
		assert.isEqual(
			favNumber,
			7,
			'Schema did not transform array of strings to single number'
		)
	}

	@test('test typing against object literal maps correctly')
	protected static testValuesTypesAgainstObjectLiteral() {
		const values: {
			name: string
			onlyOnCar: string | undefined | null
		} = {
			name: 'test',
			onlyOnCar: null,
		}
		assert.isType<SchemaDefinitionValues<typeof truckDefinition>>(values)
	}

	@test('can type values correctly')
	protected static testFullValuesTypes() {
		const personSchema = new Schema(personDefinition)
		const values = personSchema.getValues()
		const valuesWithoutInstances = personSchema.getValues({
			createSchemaInstances: false,
		})
		assert.isType<IPersonExpectedValues>(values)
		assert.isType<IPersonMappedValues>(values)
		assert.isType<IPersonExpectedValuesWithoutSchema>(valuesWithoutInstances)
	}

	@test('getting values using options by field')
	protected static testGettingOptionsByField() {
		const schema = new Schema(personDefinition)
		schema.set('name', 'a really long name that should get truncated')
		const name = schema.get('name', { byField: { name: { maxLength: 10 } } })
		assert.isEqual(name, 'a really l')
	}
}
