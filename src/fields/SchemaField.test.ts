import '@sprucelabs/path-resolver/register'
import BaseTest, { test } from '@sprucelabs/test'
import { ExecutionContext } from 'ava'
import Schema, { buildSchemaDefinition } from '..'
import { FieldType } from '#spruce:schema/fields/fieldType'
import { SchemaDefinitionValues } from '../Schema'

/** Context just for this test */
interface IContext {}

export default class SchemaFieldTest extends BaseTest {
	@test(
		'schema definition schema field types work with (test will always pass, but lint will fail)'
	)
	protected static async canAccessSpruce(t: ExecutionContext<IContext>) {
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
}
