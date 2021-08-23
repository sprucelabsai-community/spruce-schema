import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import {
	Schema,
	SchemaDefaultValues,
	StaticSchemaEntity,
	SchemaValues,
	SchemaFieldNamesWithDefaultValue,
} from '../../schemas.static.types'
import StaticSchemaEntityImplementation from '../../StaticSchemaEntityImplementation'
import buildSchema from '../../utilities/buildSchema'
import defaultSchemaValues from '../../utilities/defaultSchemaValues'
import buildPersonWithCars, {
	PersonSchema,
	CarSchema,
	TruckSchema,
} from '../data/personWithCars'

StaticSchemaEntityImplementation.enableDuplicateCheckWhenTracking = false

type PersonMappedDefaultValues = SchemaDefaultValues<PersonSchema, true>

interface PersonExpectedDefaultValues {
	optionalSelectWithDefaultValue: 'hello' | 'goodbye'
	optionalTextWithDefaultValue: string
	optionalIsArrayCarOrTruckWithDefaultValue: (
		| StaticSchemaEntity<CarSchema>
		| StaticSchemaEntity<TruckSchema>
	)[]
	optionalCarOrTruckWithDefaultValue:
		| StaticSchemaEntity<CarSchema>
		| StaticSchemaEntity<TruckSchema>
}

interface PersonExpectedDefaultValuesWithoutSchema {
	optionalSelectWithDefaultValue: 'hello' | 'goodbye'
	optionalTextWithDefaultValue: string
	optionalIsArrayCarOrTruckWithDefaultValue: {
		schemaId: 'car' | 'truck'
		values: SchemaValues<CarSchema> | SchemaValues<TruckSchema>
	}[]
	optionalCarOrTruckWithDefaultValue: {
		schemaId: 'car' | 'truck'
		values: SchemaValues<CarSchema> | SchemaValues<TruckSchema>
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
			shouldCreateEntityInstances: false,
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
		}) as StaticSchemaEntity<CarSchema>

		assert.isType<PersonMappedDefaultValues>(defaultValues)
		assert.isEqualDeep(
			defaultValues.optionalIsArrayCarOrTruckWithDefaultValue,
			[carEntity]
		)

		assert.isType<PersonExpectedDefaultValuesWithoutSchema>(
			defaultValuesWithoutSchemas
		)

		assert.isType<PersonExpectedDefaultValues>(defaultValues)
	}

	@test()
	protected static canGetDefaultValuesFromSchemaWithRequiredFields() {
		const avatar = buildSchema({
			id: 'sprucebotAvatar',
			name: 'Sprucebot avatar',
			description: '',
			fields: {
				size: {
					type: 'select',
					label: 'Size',
					isRequired: true,
					defaultValue: 'medium',
					options: {
						choices: [
							{
								value: 'small',
								label: 'Small',
							},
							{
								value: 'medium',
								label: 'Medium',
							},
							{
								value: 'large',
								label: 'Large',
							},
						],
					},
				},
				stateOfMind: {
					type: 'select',
					label: 'State of mind',
					isRequired: true,
					defaultValue: 'chill',
					options: {
						choices: [
							{
								value: 'chill',
								label:
									'Chill - Sprucebot is saying something informative or a salutation',
							},
							{
								value: 'contemplative',
								label: 'Contemplative - Sprucebot is loading or sending data',
							},
							{
								value: 'accomplished',
								label:
									'Accomplished - Sprucebot is celebrating because a process has finished',
							},
						],
					},
				},
			},
		})

		const defaults = defaultSchemaValues(avatar)

		assert.isEqualDeep(defaults, { size: 'medium', stateOfMind: 'chill' })
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
