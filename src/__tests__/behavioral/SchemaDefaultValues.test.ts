import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import {
	Schema,
	SchemaDefaultValues,
	ISchemaEntity,
	SchemaValues,
	SchemaFieldNamesWithDefaultValue,
} from '../../schemas.static.types'
import StaticSchemaEntityImplementation from '../../StaticSchemaEntityImplementation'
import buildPersonWithCars, {
	IPersonSchema,
	ICarSchema,
	ITruckSchema,
} from '../data/personWithCars'

StaticSchemaEntityImplementation.enableDuplicateCheckWhenTracking = false

type IPersonMappedDefaultValues = SchemaDefaultValues<IPersonSchema, true>

interface IPersonExpectedDefaultValues {
	optionalSelectWithDefaultValue: 'hello' | 'goodbye'
	optionalTextWithDefaultValue: string
	optionalIsArrayCarOrTruckWithDefaultValue: (
		| ISchemaEntity<ICarSchema>
		| ISchemaEntity<ITruckSchema>
	)[]
	optionalCarOrTruckWithDefaultValue:
		| ISchemaEntity<ICarSchema>
		| ISchemaEntity<ITruckSchema>
}

interface IPersonExpectedDefaultValuesWithoutSchema {
	optionalSelectWithDefaultValue: 'hello' | 'goodbye'
	optionalTextWithDefaultValue: string
	optionalIsArrayCarOrTruckWithDefaultValue: {
		schemaId: 'car' | 'truck'
		values: SchemaValues<ICarSchema> | SchemaValues<ITruckSchema>
	}[]
	optionalCarOrTruckWithDefaultValue: {
		schemaId: 'car' | 'truck'
		values: SchemaValues<ICarSchema> | SchemaValues<ITruckSchema>
	}
}

// we don't need these registered
const { personSchema, carSchema } = buildPersonWithCars()

export default class SchemaDefaultValuesTest extends AbstractSpruceTest {
	@test('Test typing on default values (test will always pass, lint will fail)')
	protected static textAndSelectDefaultValues() {
		let fieldName:
			| SchemaFieldNamesWithDefaultValue<typeof personSchema>
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

	@test('Gets default values while creating schema instances', personSchema, {
		optionalCarWithDefaultValue: new StaticSchemaEntityImplementation(
			carSchema,
			{
				name: 'fast car',
			}
		),
		optionalSelectWithDefaultValue: 'hello',
		optionalTextWithDefaultValue: 'world',
		optionalIsArrayCarOrTruckWithDefaultValue: [
			new StaticSchemaEntityImplementation(carSchema, { name: 'fast car' }),
		],
		optionalCarOrTruckWithDefaultValue: new StaticSchemaEntityImplementation(
			carSchema,
			{
				name: 'fast car',
			}
		),
	})
	protected static defaultValueTests(
		definition: Schema,
		expectedDefaultValues: Record<string, any>
	) {
		const schema = new StaticSchemaEntityImplementation(definition)
		const defaultValues = schema.getDefaultValues()
		assert.isEqualDeep(defaultValues, expectedDefaultValues)
	}

	@test('Can get default typed correctly (test will pass, lint will fail)')
	protected static defaultValueTypeTests() {
		const schema = new StaticSchemaEntityImplementation(personSchema)
		const defaultValues = schema.getDefaultValues()
		const defaultValuesWithoutSchemas = schema.getDefaultValues({
			createEntityInstances: false,
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

		const carEntity = new StaticSchemaEntityImplementation(carSchema, {
			name: 'fast car',
		}) as ISchemaEntity<ICarSchema>

		assert.isType<IPersonMappedDefaultValues>(defaultValues)
		assert.isEqualDeep(
			defaultValues.optionalIsArrayCarOrTruckWithDefaultValue,
			[carEntity]
		)

		assert.isType<IPersonExpectedDefaultValuesWithoutSchema>(
			defaultValuesWithoutSchemas
		)

		assert.isType<IPersonExpectedDefaultValues>(defaultValues)
	}

	@test()
	protected static canGetDefaultValuesForUnionFields() {
		const schema = new StaticSchemaEntityImplementation(personSchema)
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
