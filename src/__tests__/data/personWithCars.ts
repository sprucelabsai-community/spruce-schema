import SchemaEntity from '../../SchemaEntity'
import { ISchema } from '../../schemas.static.types'
import buildSchema from '../../utilities/buildSchema'

// turn off duplicate checks because tests all run in the same runtime
SchemaEntity.enableDuplicateCheckWhenTracking = false

export interface ICarSchema extends ISchema {
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

export interface ITruckSchema extends ISchema {
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

export interface IPersonSchema extends ISchema {
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
				schema: ICarSchema
			}
		}
		optionalCar: {
			type: 'schema'
			options: {
				schema: ICarSchema
			}
		}
		optionalCarWithCallback: {
			type: 'schema'
			options: {
				schemasCallback: () => [ICarSchema]
			}
		}
		optionalIsArrayCars: {
			type: 'schema'
			isArray: true
			options: {
				schema: ICarSchema
			}
		}
		requiredIsArrayCars: {
			type: 'schema'
			isArray: true
			isRequired: true
			options: {
				schema: ICarSchema
			}
		}
		optionalCarOrTruck: {
			type: 'schema'
			options: {
				schemas: [ICarSchema, ITruckSchema]
			}
		}
		optionalIsArrayCarOrTruck: {
			type: 'schema'
			isArray: true
			options: {
				schemas: [ICarSchema, ITruckSchema]
			}
		}
		requiredIsArrayCarOrTruck: {
			type: 'schema'
			isArray: true
			isRequired: true
			options: {
				schemas: [ICarSchema, ITruckSchema]
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
				schema: ICarSchema
			}
		}
		optionalIsArrayCarOrTruckWithDefaultValue: {
			type: 'schema'
			isArray: true
			defaultValue: [{ schemaId: 'car'; values: { name: 'fast car' } }]
			options: {
				schemas: [ICarSchema, ITruckSchema]
			}
		}
		optionalCarOrTruckWithDefaultValue: {
			type: 'schema'
			defaultValue: { schemaId: 'car'; values: { name: 'fast car' } }
			options: {
				schemas: [ICarSchema, ITruckSchema]
			}
		}
	}
}

const buildPersonWithCars = () => {
	const carSchema = buildSchema<ICarSchema>({
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

	const untypedCarSchema = buildSchema({
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
		},
	})

	const truckSchema = buildSchema<ITruckSchema>({
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

	const untypedTruckSchema = buildSchema({
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

	const personSchema = buildSchema<IPersonSchema>({
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

	const untypedPersonSchema = buildSchema({
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
		untypedPersonSchema,
		carSchema,
		untypedCarSchema,
		truckSchema,
		untypedTruckSchema,
	}
}

export default buildPersonWithCars
