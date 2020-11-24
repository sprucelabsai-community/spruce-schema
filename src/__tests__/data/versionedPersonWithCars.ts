import { Schema } from '../../schemas.static.types'
import StaticSchemaEntityImplementation from '../../StaticSchemaEntityImplementation'
import buildSchema from '../../utilities/buildSchema'

// turn off duplicate checks because tests all run in the same runtime
StaticSchemaEntityImplementation.enableDuplicateCheckWhenTracking = false

export interface CarV1Definition extends Schema {
	id: 'car'
	name: 'car'
	fields: {
		name: {
			type: 'text'
			isRequired: true
		}
		onlyOnCar: {
			type: 'text'
		}
	}
}

export interface CarV2Definition extends Schema {
	id: 'car'
	name: 'car'
	fields: {
		name: {
			type: 'text'
			isRequired: true
		}
		newRequiredOnCar: {
			type: 'text'
			isRequired: true
		}
	}
}

export interface TruckV1Definition extends Schema {
	id: 'truck'
	name: 'Truck'
	fields: {
		name: {
			type: 'text'
			isRequired: true
		}
		onlyOnTruck: {
			type: 'text'
		}
	}
}

export interface PersonV1Definition extends Schema {
	id: 'person'
	name: 'user schema test'
	fields: {
		name: {
			type: 'text'
			isArray: false
			value: 'tay'
		}
		requiredCar: {
			type: 'schema'
			isRequired: true
			options: {
				schema: CarV1Definition
			}
		}
		optionalCar: {
			type: 'schema'
			options: {
				schema: CarV1Definition
			}
		}
		optionalCarWithCallback: {
			type: 'schema'
			options: {
				schemasCallback: () => [CarV1Definition]
			}
		}
		optionalIsArrayCars: {
			type: 'schema'
			isArray: true
			options: {
				schema: CarV1Definition
			}
		}
		requiredIsArrayCars: {
			type: 'schema'
			isArray: true
			isRequired: true
			options: {
				schema: CarV1Definition
			}
		}
		optionalCarOrTruck: {
			type: 'schema'
			options: {
				schemas: [CarV1Definition, TruckV1Definition]
			}
		}
		optionalIsArrayCarOrTruck: {
			type: 'schema'
			isArray: true
			options: {
				schemas: [CarV1Definition, TruckV1Definition]
			}
		}
		requiredIsArrayCarOrTruck: {
			type: 'schema'
			isArray: true
			isRequired: true
			options: {
				schemas: [CarV1Definition, TruckV1Definition]
			}
		}
		optionalSelect: {
			type: 'select'
			options: {
				choices: [
					{ value: 'foo'; label: 'Foo' },
					{ value: 'bar'; label: 'Bar' }
				]
			}
		}
		optionalSelectWithDefaultValue: {
			type: 'select'
			defaultValue: 'hello'
			options: {
				choices: [
					{ value: 'hello'; label: 'world' },
					{ value: 'goodbye'; label: 'darling' }
				]
			}
		}
		optionalTextWithDefaultValue: {
			type: 'text'
			defaultValue: 'world'
		}
		optionalCarWithDefaultValue: {
			type: 'schema'
			defaultValue: { name: 'fast car' }
			options: {
				schema: CarV1Definition
			}
		}
		optionalIsArrayCarOrTruckWithDefaultValue: {
			type: 'schema'
			isArray: true
			defaultValue: [{ schemaId: 'car'; values: { name: 'fast car' } }]
			options: {
				schemas: [CarV1Definition, TruckV1Definition]
			}
		}
		optionalCarOrTruckWithDefaultValue: {
			type: 'schema'
			defaultValue: { schemaId: 'car'; values: { name: 'fast car' } }
			options: {
				schemas: [CarV1Definition, TruckV1Definition]
			}
		}
	}
}

export interface PersonV2Definition extends Schema {
	id: 'person'
	name: 'user schema test'
	fields: {
		name: {
			type: 'text'
			isArray: false
			value: 'tay'
		}
		requiredCar: {
			type: 'schema'
			isRequired: true
			options: {
				schema: CarV2Definition
			}
		}
		optionalCar: {
			type: 'schema'
			options: {
				schema: CarV2Definition
			}
		}
		optionalCarWithCallback: {
			type: 'schema'
			options: {
				schemasCallback: () => [
					CarV1Definition,
					CarV2Definition,
					TruckV1Definition
				]
			}
		}
		optionalIsArrayCars: {
			type: 'schema'
			isArray: true
			options: {
				schema: CarV1Definition
			}
		}
		requiredIsArrayCars: {
			type: 'schema'
			isArray: true
			isRequired: true
			options: {
				schema: CarV1Definition
			}
		}
		optionalCarOrTruck: {
			type: 'schema'
			options: {
				schemas: [CarV1Definition, CarV2Definition, TruckV1Definition]
			}
		}
		optionalIsArrayCarOrTruck: {
			type: 'schema'
			isArray: true
			options: {
				schemas: [CarV1Definition, TruckV1Definition]
			}
		}
		requiredIsArrayCarOrTruck: {
			type: 'schema'
			isArray: true
			isRequired: true
			options: {
				schemas: [CarV1Definition, TruckV1Definition]
			}
		}
		optionalSelect: {
			type: 'select'
			options: {
				choices: [
					{ value: 'foo'; label: 'Foo' },
					{ value: 'bar'; label: 'Bar' }
				]
			}
		}
		optionalSelectWithDefaultValue: {
			type: 'select'
			defaultValue: 'hello'
			options: {
				choices: [
					{ value: 'hello'; label: 'world' },
					{ value: 'goodbye'; label: 'darling' }
				]
			}
		}
		optionalTextWithDefaultValue: {
			type: 'text'
			defaultValue: 'world'
		}
		optionalCarWithDefaultValue: {
			type: 'schema'
			defaultValue: { name: 'fast car' }
			options: {
				schema: CarV1Definition
			}
		}
		optionalIsArrayCarOrTruckWithDefaultValue: {
			type: 'schema'
			isArray: true
			defaultValue: [{ schemaId: 'car'; values: { name: 'fast car' } }]
			options: {
				schemas: [CarV1Definition, TruckV1Definition]
			}
		}
		optionalCarOrTruckWithDefaultValue: {
			type: 'schema'
			defaultValue: { schemaId: 'car'; values: { name: 'fast car' } }
			options: {
				schemas: [CarV1Definition, TruckV1Definition]
			}
		}
	}
}
const buildVersionedPersonWithCars = () => {
	const carV1Schema = buildSchema<CarV1Definition>({
		id: 'car',
		name: 'car',
		version: 'v1',
		fields: {
			name: {
				type: 'text',
				isRequired: true,
			},
			onlyOnCar: {
				type: 'text',
			},
		},
	})

	const carV2Schema = buildSchema<CarV2Definition>({
		id: 'car',
		name: 'car',
		version: 'v2',
		fields: {
			name: {
				type: 'text',
				isRequired: true,
			},
			newRequiredOnCar: {
				type: 'text',
				isRequired: true,
			},
		},
	})

	const truckV1Definition = buildSchema<TruckV1Definition>({
		id: 'truck',
		name: 'Truck',
		version: 'v1',
		fields: {
			name: {
				type: 'text',
				isRequired: true,
			},
			onlyOnTruck: {
				type: 'text',
			},
		},
	})

	const personV1Schema = buildSchema<PersonV1Definition>({
		id: 'person',
		name: 'user schema test',
		version: 'v1',
		fields: {
			name: {
				type: 'text',
				isArray: false,
				value: 'tay',
			},
			requiredCar: {
				type: 'schema',
				isRequired: true,
				options: {
					schema: carV1Schema,
				},
			},
			optionalCar: {
				type: 'schema',
				options: {
					schema: carV1Schema,
				},
			},
			optionalCarWithCallback: {
				type: 'schema',
				options: {
					schemasCallback: () => [carV1Schema],
				},
			},
			optionalIsArrayCars: {
				type: 'schema',
				isArray: true,
				options: {
					schema: carV1Schema,
				},
			},
			requiredIsArrayCars: {
				type: 'schema',
				isArray: true,
				isRequired: true,
				options: {
					schema: carV1Schema,
				},
			},
			optionalCarOrTruck: {
				type: 'schema',
				options: {
					schemas: [carV1Schema, truckV1Definition],
				},
			},
			optionalIsArrayCarOrTruck: {
				type: 'schema',
				isArray: true,
				options: {
					schemas: [carV1Schema, truckV1Definition],
				},
			},
			requiredIsArrayCarOrTruck: {
				type: 'schema',
				isArray: true,
				isRequired: true,
				options: {
					schemas: [carV1Schema, truckV1Definition],
				},
			},
			optionalSelect: {
				type: 'select',
				options: {
					choices: [
						{ value: 'foo', label: 'Foo' },
						{ value: 'bar', label: 'Bar' },
					],
				},
			},
			optionalSelectWithDefaultValue: {
				type: 'select',
				defaultValue: 'hello',
				options: {
					choices: [
						{ value: 'hello', label: 'world' },
						{ value: 'goodbye', label: 'darling' },
					],
				},
			},
			optionalTextWithDefaultValue: {
				type: 'text',
				defaultValue: 'world',
			},
			optionalCarWithDefaultValue: {
				type: 'schema',
				defaultValue: { name: 'fast car' },
				options: {
					schema: carV1Schema,
				},
			},
			optionalIsArrayCarOrTruckWithDefaultValue: {
				type: 'schema',
				isArray: true,
				defaultValue: [{ schemaId: 'car', values: { name: 'fast car' } }],
				options: {
					schemas: [carV1Schema, truckV1Definition],
				},
			},
			optionalCarOrTruckWithDefaultValue: {
				type: 'schema',
				defaultValue: { schemaId: 'car', values: { name: 'fast car' } },
				options: {
					schemas: [carV1Schema, truckV1Definition],
				},
			},
		},
	})

	const personV2Schema = buildSchema<PersonV2Definition>({
		id: 'person',
		name: 'user schema test',
		version: 'v2',
		fields: {
			name: {
				type: 'text',
				isArray: false,
				value: 'tay',
			},
			requiredCar: {
				type: 'schema',
				isRequired: true,
				options: {
					schema: carV2Schema,
				},
			},
			optionalCar: {
				type: 'schema',
				options: {
					schema: carV2Schema,
				},
			},
			optionalCarWithCallback: {
				type: 'schema',
				options: {
					schemasCallback: () => [carV1Schema, carV2Schema, truckV1Definition],
				},
			},
			optionalIsArrayCars: {
				type: 'schema',
				isArray: true,
				options: {
					schema: carV1Schema,
				},
			},
			requiredIsArrayCars: {
				type: 'schema',
				isArray: true,
				isRequired: true,
				options: {
					schema: carV1Schema,
				},
			},
			optionalCarOrTruck: {
				type: 'schema',
				options: {
					schemas: [carV1Schema, carV2Schema, truckV1Definition],
				},
			},
			optionalIsArrayCarOrTruck: {
				type: 'schema',
				isArray: true,
				options: {
					schemas: [carV1Schema, truckV1Definition],
				},
			},
			requiredIsArrayCarOrTruck: {
				type: 'schema',
				isArray: true,
				isRequired: true,
				options: {
					schemas: [carV1Schema, truckV1Definition],
				},
			},
			optionalSelect: {
				type: 'select',
				options: {
					choices: [
						{ value: 'foo', label: 'Foo' },
						{ value: 'bar', label: 'Bar' },
					],
				},
			},
			optionalSelectWithDefaultValue: {
				type: 'select',
				defaultValue: 'hello',
				options: {
					choices: [
						{ value: 'hello', label: 'world' },
						{ value: 'goodbye', label: 'darling' },
					],
				},
			},
			optionalTextWithDefaultValue: {
				type: 'text',
				defaultValue: 'world',
			},
			optionalCarWithDefaultValue: {
				type: 'schema',
				defaultValue: { name: 'fast car' },
				options: {
					schema: carV1Schema,
				},
			},
			optionalIsArrayCarOrTruckWithDefaultValue: {
				type: 'schema',
				isArray: true,
				defaultValue: [{ schemaId: 'car', values: { name: 'fast car' } }],
				options: {
					schemas: [carV1Schema, truckV1Definition],
				},
			},
			optionalCarOrTruckWithDefaultValue: {
				type: 'schema',
				defaultValue: { schemaId: 'car', values: { name: 'fast car' } },
				options: {
					schemas: [carV1Schema, truckV1Definition],
				},
			},
		},
	})

	return {
		personV1Schema,
		carV1Schema,
		carV2Schema,
		truckV1Definition,
		personV2Schema,
	}
}

export default buildVersionedPersonWithCars
