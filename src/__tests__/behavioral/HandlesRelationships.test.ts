import { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import SchemaField from '../../fields/SchemaField'
import {
	ISchemaFieldDefinition,
	SchemaFieldValueTypeGenerator,
} from '../../fields/SchemaField.types'
import SchemaEntity from '../../SchemaEntity'
import { SchemaValues } from '../../schemas.static.types'
import buildPersonWithCars, {
	IPersonSchema,
	ICarSchema,
	ITruckSchema,
} from '../data/personWithCars'

const { personSchema, carSchema } = buildPersonWithCars()

export default class HandlesRelationshipsTest extends AbstractSchemaTest {
	@test()
	protected static async canDefineBasicRelationshipUsingTypes() {
		const user: SchemaValues<IPersonSchema> = {
			name: 'go team',
			requiredCar: { name: 'go cart' },
			requiredIsArrayCars: [{ name: 'car 1' }, { name: 'car 2' }],
			requiredIsArrayCarOrTruck: [],
		}

		assert.isTruthy(user.name)
		assert.isTruthy(user.requiredCar)
		assert.isEqual(user.requiredCar.name, 'go cart')
		assert.isEqualDeep(user.requiredIsArrayCars, [
			{ name: 'car 1' },
			{ name: 'car 2' },
		])
		assert.isExactType<
			typeof user.requiredIsArrayCars,
			{
				name: string
			}[]
		>(true)

		assert.isEqual(user.optionalCar, undefined)
	}

	@test()
	protected static testGettingValueReturnsSchema() {
		const person = new SchemaEntity(personSchema, {
			requiredCar: { name: 'car', onlyOnCar: 'only on car!' },
			requiredIsArrayCars: [],
			requiredIsArrayCarOrTruck: [],
		})

		const car = person.get('requiredCar')
		assert.isTruthy(car)
		assert.isEqual(car.get('onlyOnCar'), 'only on car!')
	}

	@test()
	protected static testIsArray() {
		const user = new SchemaEntity(personSchema, {
			name: 'tay',
			requiredCar: { name: 'dirty car' },
			requiredIsArrayCarOrTruck: [],
			requiredIsArrayCars: [{ name: 'dirty car' }, { name: 'clean car' }],
		})

		let cars = user.get('requiredIsArrayCars')

		let firstCarValues = cars[0].getValues()
		assert.isEqualDeep(firstCarValues, {
			name: 'dirty car',
			onlyOnCar: undefined,
			privateField: undefined,
		})

		let carsFlat = user.get('requiredIsArrayCars', {
			createEntityInstances: false,
		})

		assert.isEqualDeep(carsFlat, [
			{
				name: 'dirty car',
				onlyOnCar: undefined,
				privateField: undefined,
			},
			{
				name: 'clean car',
				onlyOnCar: undefined,
				privateField: undefined,
			},
		])

		// Test transforming to array works by setting isArray field to a single value
		// @ts-ignore
		user.values.requiredIsArrayCars = { name: 'scooter' }
		cars = user.get('requiredIsArrayCars')
		assert.isEqual(cars.length, 1)

		firstCarValues = cars[0].getValues()
		assert.isEqualDeep(firstCarValues, {
			name: 'scooter',
			onlyOnCar: undefined,
			privateField: undefined,
		})
	}

	@test()
	protected static testingUnionOfSchemas() {
		const testSingleSchemaField: SchemaFieldValueTypeGenerator<{
			type: FieldType.Schema
			options: {
				schemas: [ICarSchema, ITruckSchema]
			}
		}> = {
			schemaId: 'car',
			values: { name: 'fast car' },
		}

		if (testSingleSchemaField.schemaId === 'car') {
			assert.isEqual(testSingleSchemaField.values.name, 'fast car')
		}

		type ManyType = SchemaFieldValueTypeGenerator<{
			type: FieldType.Schema
			isArray: true
			options: {
				schemas: [ICarSchema, ITruckSchema]
			}
		}>
		const testArraySchemaField: ManyType = [
			{ schemaId: 'car', values: { name: 'the car', onlyOnCar: 'so fast' } },
			{
				schemaId: 'truck',
				values: { name: 'the truck', onlyOnTruck: 'cary so much' },
			},
		]

		testArraySchemaField.forEach((tool) => {
			if (tool.schemaId === 'truck') {
				assert.isEqual(tool.values.onlyOnTruck, 'cary so much')
			}
		})
	}

	@test()
	protected static testUnionResolutionCreatingSchemas() {
		const person = new SchemaEntity(personSchema, {
			requiredCar: { name: 'required name' },
			requiredIsArrayCars: [],
			requiredIsArrayCarOrTruck: [
				{
					schemaId: 'car',
					values: { name: 'fast car 1', onlyOnCar: 'so much fast' },
				},
				{ schemaId: 'truck', values: { name: 'big truck 1' } },
				{ schemaId: 'car', values: { name: 'fast car 2' } },
				{
					schemaId: 'truck',
					values: { name: 'big truck 2', onlyOnTruck: 'so much haul' },
				},
			],
		})

		const requiredCarsOrTrucks = person.get('requiredIsArrayCarOrTruck')

		assert.isEqual(requiredCarsOrTrucks[0].schemaId, 'car')
		assert.isEqual(requiredCarsOrTrucks[1].schemaId, 'truck')
		assert.isEqual(requiredCarsOrTrucks[2].schemaId, 'car')
		assert.isEqual(requiredCarsOrTrucks[3].schemaId, 'truck')

		assert.isEqual(
			requiredCarsOrTrucks[0].schemaId === 'car' &&
				requiredCarsOrTrucks[0].get('name'),
			'fast car 1'
		)
		assert.isEqual(
			requiredCarsOrTrucks[3].schemaId === 'truck' &&
				requiredCarsOrTrucks[3].get('onlyOnTruck'),
			'so much haul'
		)
	}

	@test()
	protected static testFieldWithCallback() {
		const person = new SchemaEntity(personSchema)
		const car = new SchemaEntity(carSchema, { name: 'fast' })
		person.set('optionalCarWithCallback', car.getValues())

		const carField = person
			.getNamedFields()
			.find((f) => f.name === 'optionalCarWithCallback')

		assert.isTruthy(carField)

		if (!carField) {
			return
		}

		const ids = SchemaField.mapFieldDefinitionToSchemaIdsWithVersion(
			carField.field.definition as ISchemaFieldDefinition
		)

		assert.isEqualDeep(ids, [{ id: carSchema.id }])
	}
}
