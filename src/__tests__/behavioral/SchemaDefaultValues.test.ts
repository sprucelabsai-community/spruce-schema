import BaseTest, { test, assert } from '@sprucelabs/test'
import { default as Schema } from '../../Schema'
import {
	FieldNamesWithDefaultValueSet,
	ISchemaDefinition,
	SchemaDefinitionDefaultValues,
	ISchema,
	SchemaDefinitionValues,
} from '../../schemas.static.types'
import buildPersonWithCars, {
	IPersonDefinition,
	ICarDefinition,
	ITruckDefinition,
} from '../data/personWithCars'

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

// we don't need these registered
const { personDefinition, carDefinition } = buildPersonWithCars()

export default class SchemaDefaultValuesTest extends BaseTest {
	@test('Test typing on default values (test will always pass, lint will fail)')
	protected static textAndSelectDefaultValues() {
		let fieldName:
			| FieldNamesWithDefaultValueSet<typeof personDefinition>
			| undefined

		// make sure types are 100% (only works if they are currently undefined)
		assert.isType<
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
				name: 'fast car',
			}),
			optionalSelectWithDefaultValue: 'hello',
			optionalTextWithDefaultValue: 'world',
			optionalIsArrayCarOrTruckWithDefaultValue: [
				new Schema(carDefinition, { name: 'fast car' }),
			],
			optionalCarOrTruckWithDefaultValue: new Schema(carDefinition, {
				name: 'fast car',
			}),
		}
	)
	protected static defaultValueTests(
		definition: ISchemaDefinition,
		expectedDefaultValues: Record<string, any>
	) {
		const schema = new Schema(definition)
		const defaultValues = schema.getDefaultValues()
		assert.isEqualDeep(defaultValues, expectedDefaultValues)
	}

	@test('Can get default typed correctly (test will pass, lint will fail)')
	protected static defaultValueTypeTests() {
		const schema = new Schema(personDefinition)
		const defaultValues = schema.getDefaultValues()
		const defaultValuesWithoutSchemas = schema.getDefaultValues({
			createSchemaInstances: false,
		})

		assert.isFunction(
			defaultValues.optionalIsArrayCarOrTruckWithDefaultValue[0].get
		)
		assert.isEqual(
			defaultValuesWithoutSchemas.optionalIsArrayCarOrTruckWithDefaultValue[0]
				.schemaId,
			'car'
		)
		assert.isEqual(
			defaultValuesWithoutSchemas.optionalIsArrayCarOrTruckWithDefaultValue[0]
				.values.name,
			'fast car'
		)

		const carSchema = new Schema(carDefinition, {
			name: 'fast car',
		}) as ISchema<ICarDefinition>

		assert.isType<IPersonMappedDefaultValues>(defaultValues)
		assert.isEqualDeep(
			defaultValues.optionalIsArrayCarOrTruckWithDefaultValue,
			[carSchema]
		)

		assert.isType<IPersonExpectedDefaultValuesWithoutSchema>(
			defaultValuesWithoutSchemas
		)

		assert.isType<IPersonExpectedDefaultValues>(defaultValues)
	}

	@test()
	protected static canGetDefaultValuesForUnionFields() {
		const schema = new Schema(personDefinition)
		const {
			optionalIsArrayCarOrTruckWithDefaultValue,
			optionalCarOrTruckWithDefaultValue,
		} = schema.getDefaultValues()

		assert.isFunction(optionalCarOrTruckWithDefaultValue.get)
		assert.isEqual(optionalIsArrayCarOrTruckWithDefaultValue.length, 1, '')

		assert.isEqual(
			optionalCarOrTruckWithDefaultValue.schemaId === 'car' &&
				optionalCarOrTruckWithDefaultValue.get('name'),
			'fast car'
		)

		assert.isEqual(
			optionalIsArrayCarOrTruckWithDefaultValue[0] &&
				optionalIsArrayCarOrTruckWithDefaultValue[0].schemaId === 'car' &&
				optionalIsArrayCarOrTruckWithDefaultValue[0].get('name'),
			'fast car'
		)
	}
}
