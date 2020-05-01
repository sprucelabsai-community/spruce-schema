import { buildSchemaDefinition } from '../..'
import { FieldType } from '#spruce:schema/fields/fieldType'
import { ISchemaDefinition } from '../../schema.types'
import Schema from '../../Schema'

// turn off duplicate checks because tests all run in the same runtime
Schema.enableDuplicateCheckWhenTracking = false

export interface ICarDefinition extends ISchemaDefinition {
	id: 'car'
	name: 'car'
	fields: {
		name: {
			type: FieldType.Text
			isRequired: true
		}
		onlyOnCar: {
			type: FieldType.Text
		}
	}
}

export interface ITruckDefinition extends ISchemaDefinition {
	id: 'truck'
	name: 'Truck'
	fields: {
		name: {
			type: FieldType.Text
			isRequired: true
		}
		onlyOnTruck: {
			type: FieldType.Text
		}
	}
}

export interface IPersonDefinition extends ISchemaDefinition {
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
		optionalIsArrayCars: {
			type: FieldType.Schema
			isArray: true
			options: {
				schema: ICarDefinition
			}
		}
		requiredIsArrayCars: {
			type: FieldType.Schema
			isArray: true
			isRequired: true
			options: {
				schema: ICarDefinition
			}
		}
		optionalCarOrTruck: {
			type: FieldType.Schema
			options: {
				schemas: [ICarDefinition, ITruckDefinition]
			}
		}
		optionalIsArrayCarOrTruck: {
			type: FieldType.Schema
			isArray: true
			options: {
				schemas: [ICarDefinition, ITruckDefinition]
			}
		}
		requiredIsArrayCarOrTruck: {
			type: FieldType.Schema
			isArray: true
			isRequired: true
			options: {
				schemas: [ICarDefinition, ITruckDefinition]
			}
		}
		optionalSelect: {
			type: FieldType.Select
			options: {
				choices: [
					{ value: 'foo'; label: 'Foo' },
					{ value: 'bar'; label: 'Bar' }
				]
			}
		}
	}
}

export const carDefinition = buildSchemaDefinition<ICarDefinition>({
	id: 'car',
	name: 'car',
	fields: {
		name: {
			type: FieldType.Text,
			isRequired: true
		},
		onlyOnCar: {
			type: FieldType.Text
		}
	}
})

export const truckDefinition = buildSchemaDefinition<ITruckDefinition>({
	id: 'truck',
	name: 'Truck',
	fields: {
		name: {
			type: FieldType.Text,
			isRequired: true
		},
		onlyOnTruck: {
			type: FieldType.Text
		}
	}
})

export const personDefinition = buildSchemaDefinition<IPersonDefinition>({
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
				schema: carDefinition
			}
		},
		optionalCar: {
			type: FieldType.Schema,
			options: {
				schema: carDefinition
			}
		},
		optionalIsArrayCars: {
			type: FieldType.Schema,
			isArray: true,
			options: {
				schema: carDefinition
			}
		},
		requiredIsArrayCars: {
			type: FieldType.Schema,
			isArray: true,
			isRequired: true,
			options: {
				schema: carDefinition
			}
		},
		optionalCarOrTruck: {
			type: FieldType.Schema,
			options: {
				schemas: [carDefinition, truckDefinition]
			}
		},
		optionalIsArrayCarOrTruck: {
			type: FieldType.Schema,
			isArray: true,
			options: {
				schemas: [carDefinition, truckDefinition]
			}
		},
		requiredIsArrayCarOrTruck: {
			type: FieldType.Schema,
			isArray: true,
			isRequired: true,
			options: {
				schemas: [carDefinition, truckDefinition]
			}
		},
		optionalSelect: {
			type: FieldType.Select,
			options: {
				choices: [
					{ value: 'foo', label: 'Foo' },
					{ value: 'bar', label: 'Bar' }
				]
			}
		}
	}
})
