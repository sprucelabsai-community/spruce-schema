import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import Schema from '../../Schema'
import { ISchemaDefinition } from '../../schema.types'
import buildSchemaDefinition from '../../utilities/buildSchemaDefinition'

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
		optionalCarWithCallback: {
			type: FieldType.Schema
			options: {
				schemasCallback: () => [ICarDefinition]
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
				schema: ICarDefinition
			}
		}
		optionalIsArrayCarOrTruckWithDefaultValue: {
			type: FieldType.Schema
			isArray: true
			defaultValue: [{ schemaId: 'car'; values: { name: 'fast car' } }]
			options: {
				schemas: [ICarDefinition, ITruckDefinition]
			}
		}
		optionalCarOrTruckWithDefaultValue: {
			type: FieldType.Schema
			defaultValue: { schemaId: 'car'; values: { name: 'fast car' } }
			options: {
				schemas: [ICarDefinition, ITruckDefinition]
			}
		}
	}
}

const buildPersonWithCars = () => {
	const carDefinition = buildSchemaDefinition<ICarDefinition>({
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

	const untypedCarDefinition = buildSchemaDefinition({
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

	const truckDefinition = buildSchemaDefinition<ITruckDefinition>({
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

	const untypedTruckDefinition = buildSchemaDefinition({
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

	const personDefinition = buildSchemaDefinition<IPersonDefinition>({
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
			optionalCarWithCallback: {
				type: FieldType.Schema,
				options: {
					schemasCallback: () => [carDefinition]
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
					schema: carDefinition
				}
			},
			optionalIsArrayCarOrTruckWithDefaultValue: {
				type: FieldType.Schema,
				isArray: true,
				defaultValue: [{ schemaId: 'car', values: { name: 'fast car' } }],
				options: {
					schemas: [carDefinition, truckDefinition]
				}
			},
			optionalCarOrTruckWithDefaultValue: {
				type: FieldType.Schema,
				defaultValue: { schemaId: 'car', values: { name: 'fast car' } },
				options: {
					schemas: [carDefinition, truckDefinition]
				}
			}
		}
	})

	const untypedPersonDefinition = buildSchemaDefinition({
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
			optionalCarWithCallback: {
				type: FieldType.Schema,
				options: {
					schemasCallback: () => [carDefinition]
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
					schema: carDefinition
				}
			},
			optionalIsArrayCarOrTruckWithDefaultValue: {
				type: FieldType.Schema,
				isArray: true,
				defaultValue: [{ schemaId: 'car', values: { name: 'fast car' } }],
				options: {
					schemas: [carDefinition, truckDefinition]
				}
			},
			optionalCarOrTruckWithDefaultValue: {
				type: FieldType.Schema,
				defaultValue: { schemaId: 'car', values: { name: 'fast car' } },
				options: {
					schemas: [carDefinition, truckDefinition]
				}
			}
		}
	})

	return {
		personDefinition,
		untypedPersonDefinition,
		carDefinition,
		untypedCarDefinition,
		truckDefinition,
		untypedTruckDefinition
	}
}

export default buildPersonWithCars
