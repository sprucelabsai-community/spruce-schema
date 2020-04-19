import '@sprucelabs/path-resolver/register'
import BaseTest, { test } from '@sprucelabs/test'
import { ExecutionContext } from 'ava'
import Schema from '../Schema'
import buildSchemaDefinition from '../utilities/buildSchemaDefinition'
import { FieldType } from '#spruce:schema/fields/fieldType'
import { SchemaDefinitionValues, SchemaFieldValueType } from '../Schema'

/** Context just for this test */
interface IContext {}

export default class SchemaFieldTest extends BaseTest {
	@test(
		'schema definition schema field types work with (test will always pass, but lint will fail)'
	)
	protected static async canDefineBasicRelationships(
		t: ExecutionContext<IContext>
	) {
		const carDefinition = buildSchemaDefinition({
			id: 'car',
			name: 'car',
			fields: {
				name: {
					type: FieldType.Text
				}
			}
		})

		const userDefinition = buildSchemaDefinition({
			id: 'user',
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
				familyCars: {
					type: FieldType.Schema,
					isArray: true,
					options: {
						schema: carDefinition
					}
				}
			}
		})

		const user: SchemaDefinitionValues<typeof userDefinition> = {
			name: 'go team',
			requiredCar: { name: 'go cart' }
		}

		t.assert(user.name)
		t.assert(user.requiredCar)
		t.is(user.requiredCar.name, 'go cart')
		t.is(user.optionalCar, undefined)
		t.is(user.familyCars, undefined)
	}

	@test('Testing schema field type as schema instance')
	protected static testIsArray(t: ExecutionContext<IContext>) {
		const carDefinition = buildSchemaDefinition({
			id: 'car',
			name: 'car',
			fields: {
				name: {
					type: FieldType.Text
				}
			}
		})

		const userDefinition = buildSchemaDefinition({
			id: 'user',
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
				familyCars: {
					type: FieldType.Schema,
					isArray: true,
					options: {
						schema: carDefinition
					}
				}
			}
		})

		const user = new Schema(userDefinition, {
			name: 'tay',
			requiredCar: { name: 'dirt bike' },
			familyCars: [{ name: 'go cart' }]
		})

		t.deepEqual(user.get('familyCars'), [{ name: 'go cart' }])

		// Test transforming to array works
		// @ts-ignore
		user.values.familyCars = { name: 'scooter' }
		t.deepEqual(user.get('familyCars'), [{ name: 'scooter' }])
	}

	@test('Can union many schemas')
	protected static testingUnionOfSchemas(t: ExecutionContext<IContext>) {
		const wrenchDefinition = buildSchemaDefinition({
			id: 'wrench',
			name: 'Wrench',
			fields: {
				toolType: {
					type: FieldType.Text,
					label: 'Tool type',
					value: 'wrench'
				},
				wrenchSize: {
					type: FieldType.Number,
					label: 'Size'
				}
			}
		})

		const screwdriverDefinition = buildSchemaDefinition({
			id: 'screwdriver',
			name: 'Screwdriver',
			fields: {
				toolType: {
					type: FieldType.Text,
					label: 'Tool type',
					value: 'screwdriver'
				},
				isFlathead: {
					type: FieldType.Boolean
				},
				screwdriverLength: {
					type: FieldType.Number,
					label: 'Length'
				}
			}
		})

		const personDefinition = buildSchemaDefinition({
			id: 'union-person',
			name: 'Union Person',
			fields: {
				favoriteTool: {
					type: FieldType.Schema,
					options: {
						schemas: [wrenchDefinition, screwdriverDefinition]
					}
				},
				tools: {
					type: FieldType.Schema,
					isArray: true,
					options: {
						schemas: [wrenchDefinition, screwdriverDefinition]
					}
				}
			}
		})

		const testSingleSchemaField: SchemaFieldValueType<{
			type: FieldType.Schema
			options: {
				schemas: [typeof wrenchDefinition, typeof screwdriverDefinition]
			}
		}> = {
			toolType: 'screwdriver',
			screwdriverLength: 10
		}

		if (testSingleSchemaField.toolType === 'screwdriver') {
			t.is(testSingleSchemaField.screwdriverLength, 10)
		}

		type ManyType = SchemaFieldValueType<{
			type: FieldType.Schema
			isArray: true
			options: {
				schemas: [typeof wrenchDefinition, typeof screwdriverDefinition]
			}
		}>
		const testArraySchemaField: ManyType = [
			{ toolType: 'screwdriver', screwdriverLength: 100 },
			{ toolType: 'wrench', wrenchSize: 250 }
		]

		testArraySchemaField.forEach(tool => {
			if (tool.toolType === 'wrench') {
				const wrench: SchemaDefinitionValues<typeof wrenchDefinition> = tool
				// TODO understand why this needs to be casted
				// @ts-ignore
				t.is(tool.wrenchSize, 250)
				t.is(wrench.wrenchSize, 250)
			}
		})

		// Todo why do we have to set this as a separate var?
		const newFav = {
			toolType: 'screwdriver',
			screwdriverLength: 40,
			taco: true
		}
		const person = new Schema(personDefinition, {
			favoriteTool: newFav
		})
		const favTool = person.get('favoriteTool')
		const tools = person.get('tools')

		if (favTool?.toolType === 'screwdriver') {
			const screwDriver: SchemaDefinitionValues<typeof screwdriverDefinition> = favTool
			// TODO why do we have to cast this?
			// uncomment to test
			// t.is(favTool.screwdriverLength, 40)
			t.is(screwDriver.screwdriverLength, 40)
		}
		console.log(favTool, tools)
	}
}
