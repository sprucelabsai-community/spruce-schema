import BaseTest, { test, assert } from '@sprucelabs/test'
import Schema from '../Schema'
import FieldType from '#spruce:schema/fields/fieldType'
import { SchemaDefinitionValues, SchemaFieldValueType } from '../schema.types'
import {
	IPersonDefinition,
	personDefinition,
	ICarDefinition,
	ITruckDefinition,
	carDefinition
} from '../__test_mocks__/personWithCars'
import SchemaField, { ISchemaFieldDefinition } from './SchemaField'

export default class SchemaFieldTest extends BaseTest {
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
		assert.equal(user.requiredCar.name, 'go cart')
		assert.equal(user.optionalCar, undefined)
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
		assert.equal(car.get('onlyOnCar'), 'only on car!')
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
		assert.deepEqual(firstCarValues, {
			name: 'dirty car',
			onlyOnCar: undefined
		})

		// Test transforming to array works by setting isArray field to a single value
		// @ts-ignore
		user.values.requiredIsArrayCars = { name: 'scooter' }
		cars = user.get('requiredIsArrayCars')
		assert.equal(cars.length, 1)

		firstCarValues = cars[0].getValues()
		assert.deepEqual(firstCarValues, { name: 'scooter', onlyOnCar: undefined })
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
			assert.equal(testSingleSchemaField.values.name, 'fast car')
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
				assert.equal(tool.values.onlyOnTruck, 'cary so much')
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
		assert.equal(requiredCarsOrTrucks[0].definition.id, 'car')
		assert.equal(requiredCarsOrTrucks[1].definition.id, 'truck')
		assert.equal(requiredCarsOrTrucks[2].definition.id, 'car')
		assert.equal(requiredCarsOrTrucks[3].definition.id, 'truck')

		assert.equal(
			requiredCarsOrTrucks[0].schemaId === 'car' &&
				requiredCarsOrTrucks[0].get('name'),
			'fast car 1'
		)
		assert.equal(
			requiredCarsOrTrucks[3].schemaId === 'truck' &&
				requiredCarsOrTrucks[3].get('onlyOnTruck'),
			'so much haul'
		)
	}

	@test('can use schemasCallback')
	protected static testSchemas() {
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

		const ids = SchemaField.fieldDefinitionToSchemaIds(
			carField.field.definition as ISchemaFieldDefinition
		)

		assert.deepEqual(ids, [carDefinition.id])
	}
}
