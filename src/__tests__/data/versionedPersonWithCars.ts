import SchemaEntity from '../../SchemaEntity'
import { ISchema } from '../../schemas.static.types'
import buildSchema from '../../utilities/buildSchema'

// turn off duplicate checks because tests all run in the same runtime
SchemaEntity.enableDuplicateCheckWhenTracking = false

export interface ICarV1Definition extends ISchema {
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

export interface ICarV2Definition extends ISchema {
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

export interface ITruckV1Definition extends ISchema {
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

export interface IPersonV1Definition extends ISchema {
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
				schema: ICarV1Definition
			}
		}
		optionalCar: {
			type: 'schema'
			options: {
				schema: ICarV1Definition
			}
		}
		optionalCarWithCallback: {
			type: 'schema'
			options: {
				schemasCallback: () => [ICarV1Definition]
			}
		}
		optionalIsArrayCars: {
			type: 'schema'
			isArray: true
			options: {
				schema: ICarV1Definition
			}
		}
		requiredIsArrayCars: {
			type: 'schema'
			isArray: true
			isRequired: true
			options: {
				schema: ICarV1Definition
			}
		}
		optionalCarOrTruck: {
			type: 'schema'
			options: {
				schemas: [ICarV1Definition, ITruckV1Definition]
			}
		}
		optionalIsArrayCarOrTruck: {
			type: 'schema'
			isArray: true
			options: {
				schemas: [ICarV1Definition, ITruckV1Definition]
			}
		}
		requiredIsArrayCarOrTruck: {
			type: 'schema'
			isArray: true
			isRequired: true
			options: {
				schemas: [ICarV1Definition, ITruckV1Definition]
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
				schema: ICarV1Definition
			}
		}
		optionalIsArrayCarOrTruckWithDefaultValue: {
			type: 'schema'
			isArray: true
			defaultValue: [{ schemaId: 'car'; values: { name: 'fast car' } }]
			options: {
				schemas: [ICarV1Definition, ITruckV1Definition]
			}
		}
		optionalCarOrTruckWithDefaultValue: {
			type: 'schema'
			defaultValue: { schemaId: 'car'; values: { name: 'fast car' } }
			options: {
				schemas: [ICarV1Definition, ITruckV1Definition]
			}
		}
	}
}

export interface IPersonV2Definition extends ISchema {
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
				schema: ICarV2Definition
			}
		}
		optionalCar: {
			type: 'schema'
			options: {
				schema: ICarV2Definition
			}
		}
		optionalCarWithCallback: {
			type: 'schema'
			options: {
				schemasCallback: () => [
					ICarV1Definition,
					ICarV2Definition,
					ITruckV1Definition
				]
			}
		}
		optionalIsArrayCars: {
			type: 'schema'
			isArray: true
			options: {
				schema: ICarV1Definition
			}
		}
		requiredIsArrayCars: {
			type: 'schema'
			isArray: true
			isRequired: true
			options: {
				schema: ICarV1Definition
			}
		}
		optionalCarOrTruck: {
			type: 'schema'
			options: {
				schemas: [ICarV1Definition, ICarV2Definition, ITruckV1Definition]
			}
		}
		optionalIsArrayCarOrTruck: {
			type: 'schema'
			isArray: true
			options: {
				schemas: [ICarV1Definition, ITruckV1Definition]
			}
		}
		requiredIsArrayCarOrTruck: {
			type: 'schema'
			isArray: true
			isRequired: true
			options: {
				schemas: [ICarV1Definition, ITruckV1Definition]
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
				schema: ICarV1Definition
			}
		}
		optionalIsArrayCarOrTruckWithDefaultValue: {
			type: 'schema'
			isArray: true
			defaultValue: [{ schemaId: 'car'; values: { name: 'fast car' } }]
			options: {
				schemas: [ICarV1Definition, ITruckV1Definition]
			}
		}
		optionalCarOrTruckWithDefaultValue: {
			type: 'schema'
			defaultValue: { schemaId: 'car'; values: { name: 'fast car' } }
			options: {
				schemas: [ICarV1Definition, ITruckV1Definition]
			}
		}
	}
}
const buildVersionedPersonWithCars = () => {
	const carV1Schema = buildSchema<ICarV1Definition>({
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

	const carV2Schema = buildSchema<ICarV2Definition>({
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

	const truckV1Definition = buildSchema<ITruckV1Definition>({
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

	const personV1Schema = buildSchema<IPersonV1Definition>({
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

	const personV2Schema = buildSchema<IPersonV2Definition>({
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
