import BaseTest, { test, assert } from '@sprucelabs/test'
import Schema from '../Schema'
import buildSchemaDefinition from '../utilities/buildSchemaDefinition'
import { FieldType } from '#spruce:schema/fields/fieldType'
import { SchemaDefinitionValues, SchemaFieldValueType } from '../schema.types'

interface ICarDefinition {
	id: 'car'
	name: 'car'
	fields: {
		name: {
			type: FieldType.Text
		}
		onlyOnCar: {
			type: FieldType.Text
		}
	}
}

interface ITruckDefinition {
	id: 'truck'
	name: 'Truck'
	fields: {
		name: {
			type: FieldType.Text
		}
		onlyOnTruck: {
			type: FieldType.Text
		}
	}
}

interface IPersonDefinition {
	id: 'person'
	name: 'user schema test'
	fields: {
		name: {
			type: FieldType.Text
			isArray: false
			value: 'tay'
		}
		requiredCar: {
			type: FieldType.Schema
			isRequired: true
			options: {
				schema: ICarDefinition
			}
		}
		optionalCar: {
			type: FieldType.Schema
			options: {
				schema: ICarDefinition
			}
		}
		familyCars: {
			type: FieldType.Schema
			isArray: true
			options: {
				schema: ICarDefinition
			}
		}
		favoriteVehicle: {
			type: FieldType.Schema
			options: {
				schemas: [ICarDefinition, ITruckDefinition]
			}
		}
		vehicles: {
			type: FieldType.Schema
			isArray: true
			options: {
				schemas: [ICarDefinition, ITruckDefinition]
			}
		}
	}
}

export default class SchemaFieldTest extends BaseTest {
	private static carDefinition = buildSchemaDefinition<ICarDefinition>({
		id: 'car',
		name: 'car',
		fields: {
			name: {
				type: FieldType.Text
			},
			onlyOnCar: {
				type: FieldType.Text
			}
		}
	})

	private static truckDefinition = buildSchemaDefinition<ITruckDefinition>({
		id: 'truck',
		name: 'Truck',
		fields: {
			name: {
				type: FieldType.Text
			},
			onlyOnTruck: {
				type: FieldType.Text
			}
		}
	})

	private static personDefinition = buildSchemaDefinition<IPersonDefinition>({
		id: 'person',
		name: 'user schema test',
		fields: {
			name: {
				type: FieldType.Text,
				isArray: false,
				value: 'tay'
			},
			requiredCar: {
				type: FieldType.Schema,
				isRequired: true,
				options: {
					schema: SchemaFieldTest.carDefinition
				}
			},
			optionalCar: {
				type: FieldType.Schema,
				options: {
					schema: SchemaFieldTest.carDefinition
				}
			},
			familyCars: {
				type: FieldType.Schema,
				isArray: true,
				options: {
					schema: SchemaFieldTest.carDefinition
				}
			},
			favoriteVehicle: {
				type: FieldType.Schema,
				options: {
					schemas: [
						SchemaFieldTest.carDefinition,
						SchemaFieldTest.truckDefinition
					]
				}
			},
			vehicles: {
				type: FieldType.Schema,
				isArray: true,
				options: {
					schemas: [
						SchemaFieldTest.carDefinition,
						SchemaFieldTest.truckDefinition
					]
				}
			}
		}
	})

	protected static async beforeAll() {
		// make sure the mapping is read to go
		Schema.definitionsByKey = {
			car: SchemaFieldTest.carDefinition,
			truck: SchemaFieldTest.truckDefinition,
			person: SchemaFieldTest.personDefinition
		}
	}

	@test(
		'schema definition schema field types work with (test will always pass, but lint will fail)'
	)
	protected static async canDefineBasicRelationships() {
		const user: SchemaDefinitionValues<IPersonDefinition> = {
			name: 'go team',
			requiredCar: { name: 'go cart' }
		}

		assert.isOk(user.name)
		assert.isOk(user.requiredCar)
		assert.equal(user.requiredCar.name, 'go cart')
		assert.equal(user.optionalCar, undefined)
		assert.equal(user.familyCars, undefined)
	}

	@test('test getting value returns schema instance')
	protected static testGettingValueReturnsSchema() {
		const person = new Schema(SchemaFieldTest.personDefinition, {
			favoriteVehicle: {
				schemaId: 'car',
				values: {
					onlyOnCar: 'oh so fast'
				}
			}
		})
		const favVehicle = person.get('favoriteVehicle')
		// Const tools = person.get('tools')

		console.log(favVehicle)

		// if (favVehicle?.schemaId === 'car') {
		// 	assert.equal(favVehicle.values., 'oh so fast')
		// }
	}

	@test('Testing schema field type as schema instance')
	protected static testIsArray() {
		const user = new Schema(SchemaFieldTest.personDefinition, {
			name: 'tay',
			requiredCar: { name: 'dirt bike' },
			familyCars: [{ name: 'go cart' }]
		})

		let familyCars = user.get('familyCars')
		let firstCarValues = familyCars[0].getValues()
		assert.deepEqual(firstCarValues, { name: 'go cart', onlyOnCar: undefined })

		// Test transforming to array works by setting isArray field to a single value
		// @ts-ignore
		user.values.familyCars = { name: 'scooter' }
		familyCars = user.get('familyCars')
		firstCarValues = familyCars[0].getValues()

		assert.deepEqual(firstCarValues, { name: 'scooter', onlyOnCar: undefined })
	}

	@test('Can create type for many schemas')
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
			{ schemaId: 'car', values: { onlyOnCar: 'so fast' } },
			{ schemaId: 'truck', values: { onlyOnTruck: 'cary so much' } }
		]

		testArraySchemaField.forEach(tool => {
			if (tool.schemaId === 'truck') {
				assert.equal(tool.values.onlyOnTruck, 'cary so much')
			}
		})
	}
}
