import '@sprucelabs/path-resolver/register'
import BaseTest, { test, ISpruce } from '@sprucelabs/test'
import { ExecutionContext } from 'ava'
import buildSchemaDefinition from './utilities/buildSchemaDefinition'
import Schema, { SchemaError } from '.'
import { FieldType } from '#spruce:schema/fields/fieldType'
import { unset } from 'lodash'
import { SchemaErrorCode } from './errors/types'

/** Context just for this test */
interface IContext {}

export default class SchemaTest extends BaseTest {
	@test('Can do basic definition validation')
	protected static async canAccessSpruce(t: ExecutionContext<IContext>) {
		const definition = buildSchemaDefinition({
			id: 'simple-test',
			name: 'Simple Test Schema'
		})

		t.false(
			Schema.isDefinitionValid(definition),
			'Bad definition incorrectly passed valid check'
		)
	}

	@test('Catches missing id', 'id', ['id_missing'])
	@test('Catches missing name', 'name', ['name_missing'])
	@test('Catches missing fields', 'fields', [
		'needs_fields_or_dynamic_key_signature'
	])
	protected static async testMissingKeys(
		t: ExecutionContext<IContext>,
		spruce: ISpruce,
		fieldToDelete: string,
		expectedErrors: string[]
	) {
		const definition = buildSchemaDefinition({
			id: 'missing-fields',
			name: 'missing name',
			fields: {
				firstName: {
					type: FieldType.Text
				},
				lastName: {
					type: FieldType.Text
				}
			}
		})

		unset(definition, fieldToDelete)

		const error = t.throws(() => Schema.validateDefinition(definition))

		if (
			error instanceof SchemaError &&
			error.options.code === SchemaErrorCode.InvalidSchemaDefinition
		) {
			const {
				options: { errors }
			} = error

			t.deepEqual(
				errors,
				expectedErrors,
				'Did not get back the error I expected'
			)
		} else {
			t.fail('Schema.validateDefinition should return a SchemaError')
		}
	}

	@test(
		'Does isArray make value an array (test always passes, linting should fail if broken)'
	)
	protected static async canIsArrayValue(t: ExecutionContext<IContext>) {
		const definition = buildSchemaDefinition({
			id: 'is-array-test',
			name: 'is array',
			fields: {
				name: {
					type: FieldType.Text,
					label: 'Name',
					value: 'Tay'
				},
				nicknames: {
					type: FieldType.Text,
					label: 'Nick names',
					isArray: true,
					value: ['Tay', 'Taylor']
				},
				anotherName: {
					type: FieldType.Number,
					label: 'Favorite numbers',
					isArray: true,
					value: [10, 5, 5]
				}
			}
		})

		t.true(Schema.isDefinitionValid(definition))
	}

	@test('isArray get/set work and transform to/from array')
	protected static testGetSet(t: ExecutionContext<IContext>) {
		const schema = new Schema({
			id: 'missing-fields',
			name: 'missing name',
			fields: {
				name: {
					type: FieldType.Text,
					isArray: false,
					value: 'tay'
				},
				favoriteColors: {
					type: FieldType.Text,
					isArray: true,
					value: ['black']
				}
			}
		})

		const values = schema.getValues({ fields: ['name'] })
		t.is(values.name, 'tay')
		//@ts-ignore
		t.is(values.favoriteColors, undefined, 'getValues did not filter by fields')

		// Try setting favorite colors
		schema.set('favoriteColors', ['test'])
		t.deepEqual(
			schema.values.favoriteColors,
			['test'],
			'Did not set value correctly'
		)

		// Try setting favorite color wrong, but should be coerced back to an array
		// @ts-ignore
		schema.set('favoriteColors', 'test2')
		t.deepEqual(
			schema.values.favoriteColors,
			['test2'],
			'Did not set value correctly'
		)

		// Check non array values too
		schema.set('name', 'Taylor')
		t.deepEqual(schema.values, { name: 'Taylor', favoriteColors: ['test2'] })

		// Make sure getters work
		// @ts-ignore
		schema.values = { name: ['becca'], favoriteColors: 'blue' }
		const name = schema.get('name')
		t.is(name, 'becca')

		const colors = schema.get('favoriteColors')
		t.true(Array.isArray(colors), 'Getter did not transform colors into array')
	}

	@test('Can transform isArray values')
	protected static testTransformingValues(t: ExecutionContext<IContext>) {
		const schema = new Schema({
			id: 'is-array-transform',
			name: 'transform tests',
			fields: {
				name: {
					type: FieldType.Text,
					isArray: false,
					value: 'tay'
				},
				favoriteColors: {
					type: FieldType.Text,
					isArray: true,
					value: ['blue']
				},
				favoriteNumber: {
					type: FieldType.Number
				}
			}
		})

		// Set favorite color to a bunch of numbers and make sure it comes back a bunch of strings
		// @ts-ignore
		schema.values.favoriteColors = [1, 2, 3]

		const favColors = schema.get('favoriteColors')
		t.deepEqual(favColors, ['1', '2', '3'])

		// Opposite test
		// @ts-ignore
		schema.values.favoriteNumber = ['7', '8', '100']
		const favNumber = schema.get('favoriteNumber')
		t.is(
			favNumber,
			7,
			'Schema did not transform array of strings to single number'
		)
	}
}
