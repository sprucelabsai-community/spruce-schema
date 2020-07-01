import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import Schema from '../../Schema'
import { ISchemaDefinition } from '../../schema.types'
import buildSchemaDefinition from '../../utilities/buildSchemaDefinition'

// turn off duplicate checks because tests all run in the same runtime
Schema.enableDuplicateCheckWhenTracking = false

export interface ICarV1Definition extends ISchemaDefinition {
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

export interface ICarV2Definition extends ISchemaDefinition {
	id: 'car'
	name: 'car'
	fields: {
		name: {
			type: FieldType.Text
			isRequired: true
		}
		newRequiredOnCar: {
			type: FieldType.Text
			isRequired: true
		}
	}
}

export interface ITruckV1Definition extends ISchemaDefinition {
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

export interface IPersonV1Definition extends ISchemaDefinition {
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
				schema: ICarV1Definition
			}
		}
		optionalCar: {
			type: FieldType.Schema
			options: {
				schema: ICarV1Definition
			}
		}
		optionalCarWithCallback: {
			type: FieldType.Schema
			options: {
				schemasCallback: () => [ICarV1Definition]
			}
		}
		optionalIsArrayCars: {
			type: FieldType.Schema
			isArray: true
			options: {
				schema: ICarV1Definition
			}
		}
		requiredIsArrayCars: {
			type: FieldType.Schema
			isArray: true
			isRequired: true
			options: {
				schema: ICarV1Definition
			}
		}
		optionalCarOrTruck: {
			type: FieldType.Schema
			options: {
				schemas: [ICarV1Definition, ITruckV1Definition]
			}
		}
		optionalIsArrayCarOrTruck: {
			type: FieldType.Schema
			isArray: true
			options: {
				schemas: [ICarV1Definition, ITruckV1Definition]
			}
		}
		requiredIsArrayCarOrTruck: {
			type: FieldType.Schema
			isArray: true
			isRequired: true
			options: {
				schemas: [ICarV1Definition, ITruckV1Definition]
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
		optionalSelectWithDefaultValue: {
			type: FieldType.Select
			defaultValue: 'hello'
			options: {
				choices: [
					{ value: 'hello'; label: 'world' },
					{ value: 'goodbye'; label: 'darling' }
				]
			}
		}
		optionalTextWithDefaultValue: {
			type: FieldType.Text
			defaultValue: 'world'
		}
		optionalCarWithDefaultValue: {
			type: FieldType.Schema
			defaultValue: { name: 'fast car' }
			options: {
				schema: ICarV1Definition
			}
		}
		optionalIsArrayCarOrTruckWithDefaultValue: {
			type: FieldType.Schema
			isArray: true
			defaultValue: [{ schemaId: 'car'; values: { name: 'fast car' } }]
			options: {
				schemas: [ICarV1Definition, ITruckV1Definition]
			}
		}
		optionalCarOrTruckWithDefaultValue: {
			type: FieldType.Schema
			defaultValue: { schemaId: 'car'; values: { name: 'fast car' } }
			options: {
				schemas: [ICarV1Definition, ITruckV1Definition]
			}
		}
	}
}

export interface IPersonV2Definition extends ISchemaDefinition {
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
				schema: ICarV2Definition
			}
		}
		optionalCar: {
			type: FieldType.Schema
			options: {
				schema: ICarV2Definition
			}
		}
		optionalCarWithCallback: {
			type: FieldType.Schema
			options: {
				schemasCallback: () => [
					ICarV1Definition,
					ICarV2Definition,
					ITruckV1Definition
				]
			}
		}
		optionalIsArrayCars: {
			type: FieldType.Schema
			isArray: true
			options: {
				schema: ICarV1Definition
			}
		}
		requiredIsArrayCars: {
			type: FieldType.Schema
			isArray: true
			isRequired: true
			options: {
				schema: ICarV1Definition
			}
		}
		optionalCarOrTruck: {
			type: FieldType.Schema
			options: {
				schemas: [ICarV1Definition, ICarV2Definition, ITruckV1Definition]
			}
		}
		optionalIsArrayCarOrTruck: {
			type: FieldType.Schema
			isArray: true
			options: {
				schemas: [ICarV1Definition, ITruckV1Definition]
			}
		}
		requiredIsArrayCarOrTruck: {
			type: FieldType.Schema
			isArray: true
			isRequired: true
			options: {
				schemas: [ICarV1Definition, ITruckV1Definition]
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
		optionalSelectWithDefaultValue: {
			type: FieldType.Select
			defaultValue: 'hello'
			options: {
				choices: [
					{ value: 'hello'; label: 'world' },
					{ value: 'goodbye'; label: 'darling' }
				]
			}
		}
		optionalTextWithDefaultValue: {
			type: FieldType.Text
			defaultValue: 'world'
		}
		optionalCarWithDefaultValue: {
			type: FieldType.Schema
			defaultValue: { name: 'fast car' }
			options: {
				schema: ICarV1Definition
			}
		}
		optionalIsArrayCarOrTruckWithDefaultValue: {
			type: FieldType.Schema
			isArray: true
			defaultValue: [{ schemaId: 'car'; values: { name: 'fast car' } }]
			options: {
				schemas: [ICarV1Definition, ITruckV1Definition]
			}
		}
		optionalCarOrTruckWithDefaultValue: {
			type: FieldType.Schema
			defaultValue: { schemaId: 'car'; values: { name: 'fast car' } }
			options: {
				schemas: [ICarV1Definition, ITruckV1Definition]
			}
		}
	}
}
const buildVersionedPersonWithCars = () => {
	const carV1Definition = buildSchemaDefinition<ICarV1Definition>({
		id: 'car',
		name: 'car',
		version: 'v1',
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

	const carV2Definition = buildSchemaDefinition<ICarV2Definition>({
		id: 'car',
		name: 'car',
		version: 'v2',
		fields: {
			name: {
				type: FieldType.Text,
				isRequired: true
			},
			newRequiredOnCar: {
				type: FieldType.Text,
				isRequired: true
			}
		}
	})

	const truckV1Definition = buildSchemaDefinition<ITruckV1Definition>({
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

	const personV1Definition = buildSchemaDefinition<IPersonV1Definition>({
		id: 'person',
		name: 'user schema test',
		version: 'v1',
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
					schema: carV1Definition
				}
			},
			optionalCar: {
				type: FieldType.Schema,
				options: {
					schema: carV1Definition
				}
			},
			optionalCarWithCallback: {
				type: FieldType.Schema,
				options: {
					schemasCallback: () => [carV1Definition]
				}
			},
			optionalIsArrayCars: {
				type: FieldType.Schema,
				isArray: true,
				options: {
					schema: carV1Definition
				}
			},
			requiredIsArrayCars: {
				type: FieldType.Schema,
				isArray: true,
				isRequired: true,
				options: {
					schema: carV1Definition
				}
			},
			optionalCarOrTruck: {
				type: FieldType.Schema,
				options: {
					schemas: [carV1Definition, truckV1Definition]
				}
			},
			optionalIsArrayCarOrTruck: {
				type: FieldType.Schema,
				isArray: true,
				options: {
					schemas: [carV1Definition, truckV1Definition]
				}
			},
			requiredIsArrayCarOrTruck: {
				type: FieldType.Schema,
				isArray: true,
				isRequired: true,
				options: {
					schemas: [carV1Definition, truckV1Definition]
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
			},
			optionalSelectWithDefaultValue: {
				type: FieldType.Select,
				defaultValue: 'hello',
				options: {
					choices: [
						{ value: 'hello', label: 'world' },
						{ value: 'goodbye', label: 'darling' }
					]
				}
			},
			optionalTextWithDefaultValue: {
				type: FieldType.Text,
				defaultValue: 'world'
			},
			optionalCarWithDefaultValue: {
				type: FieldType.Schema,
				defaultValue: { name: 'fast car' },
				options: {
					schema: carV1Definition
				}
			},
			optionalIsArrayCarOrTruckWithDefaultValue: {
				type: FieldType.Schema,
				isArray: true,
				defaultValue: [{ schemaId: 'car', values: { name: 'fast car' } }],
				options: {
					schemas: [carV1Definition, truckV1Definition]
				}
			},
			optionalCarOrTruckWithDefaultValue: {
				type: FieldType.Schema,
				defaultValue: { schemaId: 'car', values: { name: 'fast car' } },
				options: {
					schemas: [carV1Definition, truckV1Definition]
				}
			}
		}
	})

	const personV2Definition = buildSchemaDefinition<IPersonV2Definition>({
		id: 'person',
		name: 'user schema test',
		version: 'v2',
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
					schema: carV2Definition
				}
			},
			optionalCar: {
				type: FieldType.Schema,
				options: {
					schema: carV2Definition
				}
			},
			optionalCarWithCallback: {
				type: FieldType.Schema,
				options: {
					schemasCallback: () => [
						carV1Definition,
						carV2Definition,
						truckV1Definition
					]
				}
			},
			optionalIsArrayCars: {
				type: FieldType.Schema,
				isArray: true,
				options: {
					schema: carV1Definition
				}
			},
			requiredIsArrayCars: {
				type: FieldType.Schema,
				isArray: true,
				isRequired: true,
				options: {
					schema: carV1Definition
				}
			},
			optionalCarOrTruck: {
				type: FieldType.Schema,
				options: {
					schemas: [carV1Definition, carV2Definition, truckV1Definition]
				}
			},
			optionalIsArrayCarOrTruck: {
				type: FieldType.Schema,
				isArray: true,
				options: {
					schemas: [carV1Definition, truckV1Definition]
				}
			},
			requiredIsArrayCarOrTruck: {
				type: FieldType.Schema,
				isArray: true,
				isRequired: true,
				options: {
					schemas: [carV1Definition, truckV1Definition]
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
			},
			optionalSelectWithDefaultValue: {
				type: FieldType.Select,
				defaultValue: 'hello',
				options: {
					choices: [
						{ value: 'hello', label: 'world' },
						{ value: 'goodbye', label: 'darling' }
					]
				}
			},
			optionalTextWithDefaultValue: {
				type: FieldType.Text,
				defaultValue: 'world'
			},
			optionalCarWithDefaultValue: {
				type: FieldType.Schema,
				defaultValue: { name: 'fast car' },
				options: {
					schema: carV1Definition
				}
			},
			optionalIsArrayCarOrTruckWithDefaultValue: {
				type: FieldType.Schema,
				isArray: true,
				defaultValue: [{ schemaId: 'car', values: { name: 'fast car' } }],
				options: {
					schemas: [carV1Definition, truckV1Definition]
				}
			},
			optionalCarOrTruckWithDefaultValue: {
				type: FieldType.Schema,
				defaultValue: { schemaId: 'car', values: { name: 'fast car' } },
				options: {
					schemas: [carV1Definition, truckV1Definition]
				}
			}
		}
	})

	return {
		personV1Definition,
		carV1Definition,
		carV2Definition,
		truckV1Definition,
		personV2Definition
	}
}

export default buildVersionedPersonWithCars
