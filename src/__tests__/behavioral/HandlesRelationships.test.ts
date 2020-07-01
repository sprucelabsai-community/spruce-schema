import { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import SchemaField, { ISchemaFieldDefinition } from '../../fields/SchemaField'
import Schema from '../../Schema'
import {
	SchemaDefinitionValues,
	SchemaFieldValueType
} from '../../schema.types'
import buildPersonWithCars, {
	IPersonDefinition,
	ICarDefinition,
	ITruckDefinition
} from '../data/personWithCars'

const { personDefinition, carDefinition } = buildPersonWithCars()

export default class HandlesRelationshipsTest extends AbstractSchemaTest {
	@test(
		'schema definition schema field types work with (test will always pass, but lint will fail)'
	)
	protected static async canDefineBasicRelationships() {
		const user: SchemaDefinitionValues<IPersonDefinition> = {
			name: 'go team',
			requiredCar: { name: 'go cart' },
			requiredIsArrayCars: [],
			requiredIsArrayCarOrTruck: []
		}

		assert.isOk(user.name)
		assert.isOk(user.requiredCar)
		assert.isEqual(user.requiredCar.name, 'go cart')
		assert.isEqual(user.optionalCar, undefined)
	}

	@test('test getting value returns schema instance')
	protected static testGettingValueReturnsSchema() {
		const person = new Schema(personDefinition, {
			requiredCar: { name: 'car', onlyOnCar: 'only on car!' },
			requiredIsArrayCars: [],
			requiredIsArrayCarOrTruck: []
		})

		const car = person.get('requiredCar')
		assert.isOk(car)
		assert.isEqual(car.get('onlyOnCar'), 'only on car!')
	}

	@test('Testing schema field type as schema instance')
	protected static testIsArray() {
		const user = new Schema(personDefinition, {
			name: 'tay',
			requiredCar: { name: 'dirty car' },
			requiredIsArrayCarOrTruck: [],
			requiredIsArrayCars: [{ name: 'dirty car' }]
		})

		let cars = user.get('requiredIsArrayCars')
		let firstCarValues = cars[0].getValues()
		assert.isEqualDeep(firstCarValues, {
			name: 'dirty car',
			onlyOnCar: undefined
		})

		// Test transforming to array works by setting isArray field to a single value
		// @ts-ignore
		user.values.requiredIsArrayCars = { name: 'scooter' }
		cars = user.get('requiredIsArrayCars')
		assert.isEqual(cars.length, 1)

		firstCarValues = cars[0].getValues()
		assert.isEqualDeep(firstCarValues, {
			name: 'scooter',
			onlyOnCar: undefined
		})
	}

	@test('Can type for many schemas')
	protected static testingUnionOfSchemas() {
		const testSingleSchemaField: SchemaFieldValueType<{
			type: FieldType.Schema
			options: {
				schemas: [ICarDefinition, ITruckDefinition]
			}
		}> = {
			schemaId: 'car',
			values: { name: 'fast car' }
		}

		if (testSingleSchemaField.schemaId === 'car') {
			assert.isEqual(testSingleSchemaField.values.name, 'fast car')
		}

		type ManyType = SchemaFieldValueType<{
			type: FieldType.Schema
			isArray: true
			options: {
				schemas: [ICarDefinition, ITruckDefinition]
			}
		}>
		const testArraySchemaField: ManyType = [
			{ schemaId: 'car', values: { name: 'the car', onlyOnCar: 'so fast' } },
			{
				schemaId: 'truck',
				values: { name: 'the truck', onlyOnTruck: 'cary so much' }
			}
		]

		testArraySchemaField.forEach(tool => {
			if (tool.schemaId === 'truck') {
				assert.isEqual(tool.values.onlyOnTruck, 'cary so much')
			}
		})
	}

	@test('will return schemas based on union field')
	protected static testUnionResolutionCreatingSchemas() {
		const person = new Schema(personDefinition, {
			requiredCar: { name: 'required name' },
			requiredIsArrayCars: [],
			requiredIsArrayCarOrTruck: [
				{
					schemaId: 'car',
					values: { name: 'fast car 1', onlyOnCar: 'so much fast' }
				},
				{ schemaId: 'truck', values: { name: 'big truck 1' } },
				{ schemaId: 'car', values: { name: 'fast car 2' } },
				{
					schemaId: 'truck',
					values: { name: 'big truck 2', onlyOnTruck: 'so much haul' }
				}
			]
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
		const person = new Schema(personDefinition)
		const car = new Schema(carDefinition, { name: 'fast' })
		person.set('optionalCarWithCallback', car.getValues())

		const carField = person
			.getNamedFields()
			.find(f => f.name === 'optionalCarWithCallback')

		assert.isOk(carField)

		if (!carField) {
			return
		}

		const ids = SchemaField.mapFieldDefinitionToSchemaIdsWithVersion(
			carField.field.definition as ISchemaFieldDefinition
		)

		assert.isEqualDeep(ids, [{ id: carDefinition.id }])
	}
}
