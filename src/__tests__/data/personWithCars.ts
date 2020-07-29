import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
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
			type: FieldType.Text
			isRequired: true
		}
		onlyOnCar: {
			type: FieldType.Text
		}
	}
}

export interface ITruckSchema extends ISchema {
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

export interface IPersonSchema extends ISchema {
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
				schema: ICarSchema
			}
		}
		optionalCar: {
			type: FieldType.Schema
			options: {
				schema: ICarSchema
			}
		}
		optionalCarWithCallback: {
			type: FieldType.Schema
			options: {
				schemasCallback: () => [ICarSchema]
			}
		}
		optionalIsArrayCars: {
			type: FieldType.Schema
			isArray: true
			options: {
				schema: ICarSchema
			}
		}
		requiredIsArrayCars: {
			type: FieldType.Schema
			isArray: true
			isRequired: true
			options: {
				schema: ICarSchema
			}
		}
		optionalCarOrTruck: {
			type: FieldType.Schema
			options: {
				schemas: [ICarSchema, ITruckSchema]
			}
		}
		optionalIsArrayCarOrTruck: {
			type: FieldType.Schema
			isArray: true
			options: {
				schemas: [ICarSchema, ITruckSchema]
			}
		}
		requiredIsArrayCarOrTruck: {
			type: FieldType.Schema
			isArray: true
			isRequired: true
			options: {
				schemas: [ICarSchema, ITruckSchema]
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
		requiredSelect: {
			type: FieldType.Select
			options: {
				isRequired: true
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
				schema: ICarSchema
			}
		}
		optionalIsArrayCarOrTruckWithDefaultValue: {
			type: FieldType.Schema
			isArray: true
			defaultValue: [{ schemaId: 'car'; values: { name: 'fast car' } }]
			options: {
				schemas: [ICarSchema, ITruckSchema]
			}
		}
		optionalCarOrTruckWithDefaultValue: {
			type: FieldType.Schema
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
				type: FieldType.Text,
				isRequired: true,
			},
			onlyOnCar: {
				type: FieldType.Text,
			},
		},
	})

	const untypedCarSchema = buildSchema({
		id: 'car',
		name: 'car',
		fields: {
			name: {
				type: FieldType.Text,
				isRequired: true,
			},
			onlyOnCar: {
				type: FieldType.Text,
			},
		},
	})

	const truckSchema = buildSchema<ITruckSchema>({
		id: 'truck',
		name: 'Truck',
		fields: {
			name: {
				type: FieldType.Text,
				isRequired: true,
			},
			onlyOnTruck: {
				type: FieldType.Text,
			},
		},
	})

	const untypedTruckSchema = buildSchema({
		id: 'truck',
		name: 'Truck',
		fields: {
			name: {
				type: FieldType.Text,
				isRequired: true,
			},
			onlyOnTruck: {
				type: FieldType.Text,
			},
		},
	})

	const personSchema = buildSchema<IPersonSchema>({
		id: 'person',
		name: 'user schema test',
		fields: {
			name: {
				type: FieldType.Text,
				isArray: false,
				value: 'tay',
			},
			requiredCar: {
				type: FieldType.Schema,
				isRequired: true,
				options: {
					schema: carSchema,
				},
			},
			optionalCar: {
				type: FieldType.Schema,
				options: {
					schema: carSchema,
				},
			},
			optionalCarWithCallback: {
				type: FieldType.Schema,
				options: {
					schemasCallback: () => [carSchema],
				},
			},
			optionalIsArrayCars: {
				type: FieldType.Schema,
				isArray: true,
				options: {
					schema: carSchema,
				},
			},
			requiredIsArrayCars: {
				type: FieldType.Schema,
				isArray: true,
				isRequired: true,
				options: {
					schema: carSchema,
				},
			},
			optionalCarOrTruck: {
				type: FieldType.Schema,
				options: {
					schemas: [carSchema, truckSchema],
				},
			},
			optionalIsArrayCarOrTruck: {
				type: FieldType.Schema,
				isArray: true,
				options: {
					schemas: [carSchema, truckSchema],
				},
			},
			requiredIsArrayCarOrTruck: {
				type: FieldType.Schema,
				isArray: true,
				isRequired: true,
				options: {
					schemas: [carSchema, truckSchema],
				},
			},
			optionalSelect: {
				type: FieldType.Select,
				options: {
					choices: [
						{ value: 'foo', label: 'Foo' },
						{ value: 'bar', label: 'Bar' },
					],
				},
			},
			requiredSelect: {
				type: FieldType.Select,
				options: {
					isRequired: true,
					choices: [
						{ value: 'foo', label: 'Foo' },
						{ value: 'bar', label: 'Bar' },
					],
				},
			},
			optionalSelectWithDefaultValue: {
				type: FieldType.Select,
				defaultValue: 'hello',
				options: {
					choices: [
						{ value: 'hello', label: 'world' },
						{ value: 'goodbye', label: 'darling' },
					],
				},
			},
			optionalTextWithDefaultValue: {
				type: FieldType.Text,
				defaultValue: 'world',
			},
			optionalCarWithDefaultValue: {
				type: FieldType.Schema,
				defaultValue: { name: 'fast car' },
				options: {
					schema: carSchema,
				},
			},
			optionalIsArrayCarOrTruckWithDefaultValue: {
				type: FieldType.Schema,
				isArray: true,
				defaultValue: [{ schemaId: 'car', values: { name: 'fast car' } }],
				options: {
					schemas: [carSchema, truckSchema],
				},
			},
			optionalCarOrTruckWithDefaultValue: {
				type: FieldType.Schema,
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
				type: FieldType.Text,
				isArray: false,
				value: 'tay',
			},
			requiredCar: {
				type: FieldType.Schema,
				isRequired: true,
				options: {
					schema: carSchema,
				},
			},
			optionalCar: {
				type: FieldType.Schema,
				options: {
					schema: carSchema,
				},
			},
			optionalCarWithCallback: {
				type: FieldType.Schema,
				options: {
					schemasCallback: () => [carSchema],
				},
			},
			optionalIsArrayCars: {
				type: FieldType.Schema,
				isArray: true,
				options: {
					schema: carSchema,
				},
			},
			requiredIsArrayCars: {
				type: FieldType.Schema,
				isArray: true,
				isRequired: true,
				options: {
					schema: carSchema,
				},
			},
			optionalCarOrTruck: {
				type: FieldType.Schema,
				options: {
					schemas: [carSchema, truckSchema],
				},
			},
			optionalIsArrayCarOrTruck: {
				type: FieldType.Schema,
				isArray: true,
				options: {
					schemas: [carSchema, truckSchema],
				},
			},
			requiredIsArrayCarOrTruck: {
				type: FieldType.Schema,
				isArray: true,
				isRequired: true,
				options: {
					schemas: [carSchema, truckSchema],
				},
			},
			optionalSelect: {
				type: FieldType.Select,
				options: {
					choices: [
						{ value: 'foo', label: 'Foo' },
						{ value: 'bar', label: 'Bar' },
					],
				},
			},
			optionalSelectWithDefaultValue: {
				type: FieldType.Select,
				defaultValue: 'hello',
				options: {
					choices: [
						{ value: 'hello', label: 'world' },
						{ value: 'goodbye', label: 'darling' },
					],
				},
			},
			optionalTextWithDefaultValue: {
				type: FieldType.Text,
				defaultValue: 'world',
			},
			optionalCarWithDefaultValue: {
				type: FieldType.Schema,
				defaultValue: { name: 'fast car' },
				options: {
					schema: carSchema,
				},
			},
			optionalIsArrayCarOrTruckWithDefaultValue: {
				type: FieldType.Schema,
				isArray: true,
				defaultValue: [{ schemaId: 'car', values: { name: 'fast car' } }],
				options: {
					schemas: [carSchema, truckSchema],
				},
			},
			optionalCarOrTruckWithDefaultValue: {
				type: FieldType.Schema,
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
