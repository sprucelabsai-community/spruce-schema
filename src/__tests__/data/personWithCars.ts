import { Schema } from '../../schemas.static.types'
import StaticSchemaEntityImplementation from '../../StaticSchemaEntityImplementation'
import buildSchema from '../../utilities/buildSchema'

// turn off duplicate checks because tests all run in the same runtime
StaticSchemaEntityImplementation.enableDuplicateCheckWhenTracking = false

export interface CarSchema extends Schema {
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
		privateField: {
			type: 'text'
			isPrivate: true
		}
	}
}

export interface TruckSchema extends Schema {
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

export interface PersonSchema extends Schema {
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
				schema: CarSchema
			}
		}
		optionalCar: {
			type: 'schema'
			options: {
				schema: CarSchema
			}
		}
		optionalCarWithCallback: {
			type: 'schema'
			options: {
				schemasCallback: () => [CarSchema]
			}
		}
		optionalIsArrayCars: {
			type: 'schema'
			isArray: true
			options: {
				schema: CarSchema
			}
		}
		requiredIsArrayCars: {
			type: 'schema'
			isArray: true
			isRequired: true
			options: {
				schema: CarSchema
			}
		}
		optionalCarOrTruck: {
			type: 'schema'
			options: {
				schemas: [CarSchema, TruckSchema]
			}
		}
		optionalIsArrayCarOrTruck: {
			type: 'schema'
			isArray: true
			options: {
				schemas: [CarSchema, TruckSchema]
			}
		}
		requiredIsArrayCarOrTruck: {
			type: 'schema'
			isArray: true
			isRequired: true
			options: {
				schemas: [CarSchema, TruckSchema]
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
		requiredSelect: {
			type: 'select'
			options: {
				isRequired: true
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
				schema: CarSchema
			}
		}
		optionalIsArrayCarOrTruckWithDefaultValue: {
			type: 'schema'
			isArray: true
			defaultValue: [{ schemaId: 'car'; values: { name: 'fast car' } }]
			options: {
				schemas: [CarSchema, TruckSchema]
			}
		}
		optionalCarOrTruckWithDefaultValue: {
			type: 'schema'
			defaultValue: { schemaId: 'car'; values: { name: 'fast car' } }
			options: {
				schemas: [CarSchema, TruckSchema]
			}
		}
	}
}

const buildPersonWithCars = () => {
	const carSchema = buildSchema<CarSchema>({
		id: 'car',
		name: 'car',
		fields: {
			name: {
				type: 'text',
				isRequired: true,
			},
			onlyOnCar: {
				type: 'text',
			},
			privateField: {
				type: 'text',
				isPrivate: true,
			},
		},
	})

	const truckSchema = buildSchema<TruckSchema>({
		id: 'truck',
		name: 'Truck',
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

	const personSchema = buildSchema<PersonSchema>({
		id: 'person',
		name: 'user schema test',
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
					schema: carSchema,
				},
			},
			optionalCar: {
				type: 'schema',
				options: {
					schema: carSchema,
				},
			},
			optionalCarWithCallback: {
				type: 'schema',
				options: {
					schemasCallback: () => [carSchema],
				},
			},
			optionalIsArrayCars: {
				type: 'schema',
				isArray: true,
				options: {
					schema: carSchema,
				},
			},
			requiredIsArrayCars: {
				type: 'schema',
				isArray: true,
				isRequired: true,
				options: {
					schema: carSchema,
				},
			},
			optionalCarOrTruck: {
				type: 'schema',
				options: {
					schemas: [carSchema, truckSchema],
				},
			},
			optionalIsArrayCarOrTruck: {
				type: 'schema',
				isArray: true,
				options: {
					schemas: [carSchema, truckSchema],
				},
			},
			requiredIsArrayCarOrTruck: {
				type: 'schema',
				isArray: true,
				isRequired: true,
				options: {
					schemas: [carSchema, truckSchema],
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
			requiredSelect: {
				type: 'select',
				options: {
					isRequired: true,
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
					schema: carSchema,
				},
			},
			optionalIsArrayCarOrTruckWithDefaultValue: {
				type: 'schema',
				isArray: true,
				defaultValue: [{ schemaId: 'car', values: { name: 'fast car' } }],
				options: {
					schemas: [carSchema, truckSchema],
				},
			},
			optionalCarOrTruckWithDefaultValue: {
				type: 'schema',
				defaultValue: { schemaId: 'car', values: { name: 'fast car' } },
				options: {
					schemas: [carSchema, truckSchema],
				},
			},
		},
	})

	return {
		personSchema,
		carSchema,
		truckSchema,
	}
}

export default buildPersonWithCars
