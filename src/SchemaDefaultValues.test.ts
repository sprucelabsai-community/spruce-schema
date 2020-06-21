import BaseTest, { test, ISpruce, assert } from '@sprucelabs/test'
import { default as Schema } from './Schema'
import {
	FieldNamesWithDefaultValueSet,
	ISchemaDefinition,
	SchemaDefinitionDefaultValues,
	ISchema,
	SchemaDefinitionValues
} from './schema.types'
import {
	IPersonDefinition,
	personDefinition,
	carDefinition,
	ICarDefinition,
	ITruckDefinition
} from './__test_mocks__/personWithCars'

Schema.enableDuplicateCheckWhenTracking = false

type IPersonMappedDefaultValues = SchemaDefinitionDefaultValues<
	IPersonDefinition,
	true
>

interface IPersonExpectedDefaultValues {
	optionalSelectWithDefaultValue: 'hello' | 'goodbye'
	optionalTextWithDefaultValue: string
	optionalIsArrayCarOrTruckWithDefaultValue: (
		| ISchema<ICarDefinition>
		| ISchema<ITruckDefinition>
	)[]
	optionalCarOrTruckWithDefaultValue:
		| ISchema<ICarDefinition>
		| ISchema<ITruckDefinition>
}

interface IPersonExpectedDefaultValuesWithoutSchema {
	optionalSelectWithDefaultValue: 'hello' | 'goodbye'
	optionalTextWithDefaultValue: string
	optionalIsArrayCarOrTruckWithDefaultValue: {
		schemaId: 'car' | 'truck'
		values:
			| SchemaDefinitionValues<ICarDefinition>
			| SchemaDefinitionValues<ITruckDefinition>
	}[]
	optionalCarOrTruckWithDefaultValue: {
		schemaId: 'car' | 'truck'
		values:
			| SchemaDefinitionValues<ICarDefinition>
			| SchemaDefinitionValues<ITruckDefinition>
	}
}

export default class SchemaDefaultValuesTest extends BaseTest {
	@test('Test typing on default values (test will always pass, lint will fail)')
	protected static textAndSelectDefaultValues() {
		let fieldName:
			| FieldNamesWithDefaultValueSet<typeof personDefinition>
			| undefined

		// make sure types are 100% (only works if they are currently undefined)
		assert.expectType<
			| 'optionalSelectWithDefaultValue'
			| 'optionalTextWithDefaultValue'
			| 'optionalCarWithDefaultValue'
			| 'optionalIsArrayCarOrTruckWithDefaultValue'
			| 'optionalCarOrTruckWithDefaultValue'
			| undefined
		>(fieldName)
	}

	@test(
		'Gets default values while creating schema instances',
		personDefinition,
		{
			optionalCarWithDefaultValue: new Schema(carDefinition, {
				name: 'fast car'
			}),
			optionalSelectWithDefaultValue: 'hello',
			optionalTextWithDefaultValue: 'world',
			optionalIsArrayCarOrTruckWithDefaultValue: [
				new Schema(carDefinition, { name: 'fast car' })
			],
			optionalCarOrTruckWithDefaultValue: new Schema(carDefinition, {
				name: 'fast car'
			})
		}
	)
	protected static defaultValueTests(
		s: ISpruce,
		definition: ISchemaDefinition,
		expectedDefaultValues: Record<string, any>
	) {
		const schema = new Schema(definition)
		const defaultValues = schema.getDefaultValues()
		assert.deepEqual(defaultValues, expectedDefaultValues)
	}

	@test('Can get default typed correctly (test will pass, lint will fail)')
	protected static defaultValueTypeTests() {
		const schema = new Schema(personDefinition)
		const defaultValues = schema.getDefaultValues()
		const defaultValuesWithoutSchemas = schema.getDefaultValues({
			createSchemaInstances: false
		})

		assert.isFunction(
			defaultValues.optionalIsArrayCarOrTruckWithDefaultValue[0].get
		)
		assert.equal(
			defaultValuesWithoutSchemas.optionalIsArrayCarOrTruckWithDefaultValue[0]
				.schemaId,
			'car'
		)
		assert.equal(
			defaultValuesWithoutSchemas.optionalIsArrayCarOrTruckWithDefaultValue[0]
				.values.name,
			'fast car'
		)

		const carSchema = new Schema(carDefinition, {
			name: 'fast car'
		}) as ISchema<ICarDefinition>

		assert.expectType<IPersonMappedDefaultValues>(defaultValues)
		assert.deepEqual(defaultValues.optionalIsArrayCarOrTruckWithDefaultValue, [
			carSchema
		])

		assert.expectType<IPersonExpectedDefaultValuesWithoutSchema>(
			defaultValuesWithoutSchemas
		)

		assert.expectType<IPersonExpectedDefaultValues>(defaultValues)
	}

	@test('Can get default values for union fields')
	protected static defaultSchemaValueTests() {
		const schema = new Schema(personDefinition)
		const {
			optionalIsArrayCarOrTruckWithDefaultValue,
			optionalCarOrTruckWithDefaultValue
		} = schema.getDefaultValues()

		assert.isFunction(optionalCarOrTruckWithDefaultValue.get)
		assert.equal(optionalIsArrayCarOrTruckWithDefaultValue.length, 1, '')

		assert.equal(
			optionalCarOrTruckWithDefaultValue.schemaId === 'car' &&
				optionalCarOrTruckWithDefaultValue.get('name'),
			'fast car'
		)

		assert.equal(
			optionalIsArrayCarOrTruckWithDefaultValue[0] &&
				optionalIsArrayCarOrTruckWithDefaultValue[0].schemaId === 'car' &&
				optionalIsArrayCarOrTruckWithDefaultValue[0].get('name'),
			'fast car'
		)
	}
}
