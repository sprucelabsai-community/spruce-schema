import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { unset } from 'lodash'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import SpruceError from '../../errors/SpruceError'
import SchemaEntity from '../../SchemaEntity'
import { SchemaValues, ISchemaEntity } from '../../schemas.static.types'
import buildSchema from '../../utilities/buildSchema'
import buildPersonWithCars, {
	ICarSchema,
	ITruckSchema,
	IPersonSchema,
} from '../data/personWithCars'

SchemaEntity.enableDuplicateCheckWhenTracking = false

type IPersonMappedValues = SchemaValues<IPersonSchema, true>

interface IPersonExpectedValues {
	optionalSelectWithDefaultValue?: 'hello' | 'goodbye' | null
	optionalTextWithDefaultValue?: string | null
	optionalIsArrayCarOrTruckWithDefaultValue?:
		| (ISchemaEntity<ICarSchema> | ISchemaEntity<ITruckSchema>)[]
		| null
	optionalCarOrTruckWithDefaultValue?:
		| ISchemaEntity<ICarSchema>
		| ISchemaEntity<ITruckSchema>
		| null
}

interface IPersonExpectedValuesWithoutSchema {
	optionalSelectWithDefaultValue?: 'hello' | 'goodbye' | null
	optionalTextWithDefaultValue?: string | null
	optionalIsArrayCarOrTruckWithDefaultValue?:
		| {
				schemaId: 'car' | 'truck'
				values: SchemaValues<ICarSchema> | SchemaValues<ITruckSchema>
		  }[]
		| null
	optionalCarOrTruckWithDefaultValue?: {
		schemaId: 'car' | 'truck'
		values: SchemaValues<ICarSchema> | SchemaValues<ITruckSchema>
	} | null
}

const { personSchema, truckSchema } = buildPersonWithCars()

export default class SchemaTest extends AbstractSpruceTest {
	@test()
	protected static async testBasicValidation() {
		const schema = {
			id: 'simple-test',
			name: 'Simple Test Schema',
		}

		assert.isFalse(
			SchemaEntity.isSchemaValid(schema),
			'Bad definition incorrectly passed valid check'
		)
	}

	@test('Catches missing id', 'id', ['id_missing'])
	@test('Catches missing name', 'name', ['name_missing'])
	@test('Catches missing fields', 'fields', [
		'needs_fields_or_dynamic_key_signature',
	])
	protected static async testMissingKeys(
		fieldToDelete: string,
		expectedErrors: string[]
	) {
		const definition = buildSchema({
			id: 'missing-fields',
			name: 'missing name',
			fields: {
				firstName: {
					type: FieldType.Text,
				},
				lastName: {
					type: FieldType.Text,
				},
			},
		})

		unset(definition, fieldToDelete)

		const error: any = assert.doesThrow(() =>
			SchemaEntity.validateSchema(definition)
		)

		if (
			error instanceof SpruceError &&
			error.options.code === 'INVALID_SCHEMA_DEFINITION'
		) {
			const {
				options: { errors },
			} = error

			assert.isEqualDeep(
				errors,
				expectedErrors,
				'Did not get back the error I expected'
			)
		} else {
			assert.fail('Schema.validateDefinition should return a SpruceError')
		}
	}

	@test(
		'Does isArray make value an array (test always passes, linting should fail if broken)'
	)
	protected static async canIsArrayValue() {
		const definition = buildSchema({
			id: 'is-array-test',
			name: 'is array',
			fields: {
				name: {
					type: FieldType.Text,
					label: 'Name',
					value: 'Tay',
				},
				nicknames: {
					type: FieldType.Text,
					label: 'Nick names',
					isArray: true,
					value: ['Tay', 'Taylor'],
				},
				anotherName: {
					type: FieldType.Number,
					label: 'Favorite numbers',
					isArray: true,
					value: [10, 5, 5],
				},
				schemaField: {
					type: FieldType.Schema,
					label: 'Favorite numbers',
					isArray: true,
					options: {
						schema: {
							id: 'nested',
							name: 'Nested',
							fields: {},
						},
					},
				},
			},
		})

		assert.isTrue(SchemaEntity.isSchemaValid(definition))
	}

	@test()
	protected static getSetArrays() {
		const entity = new SchemaEntity({
			id: 'missing-fields',
			name: 'missing name',
			fields: {
				name: {
					type: FieldType.Text,
					isArray: false,
					value: 'tay',
				},
				favoriteColors: {
					type: FieldType.Text,
					isArray: true,
					value: ['black'],
				},
			},
		})

		let values = entity.getValues({ fields: ['name'] })
		assert.isEqual(values.name, 'tay')
		assert.isUndefined(
			//@ts-ignore
			values.favoriteColors,
			'getValues did not filter by fields'
		)

		entity.set('favoriteColors', ['test'])
		assert.isEqualDeep(
			entity.get('favoriteColors'),
			['test'],
			'Did not set value correctly'
		)

		// @ts-ignore
		entity.set('favoriteColors', 'test2')
		assert.isEqualDeep(
			entity.get('favoriteColors'),
			['test2'],
			'Did not set value correctly'
		)

		entity.set('name', 'Taylor')
		assert.isEqualDeep(entity.getValues(), {
			name: 'Taylor',
			favoriteColors: ['test2'],
		})

		// @ts-ignore
		entity.setValues({ name: ['becca'], favoriteColors: 'blue' })
		const name = entity.get('name')
		assert.isEqual(name, 'becca')

		const colors = entity.get('favoriteColors')
		assert.isTrue(
			Array.isArray(colors),
			'Getter did not transform colors into array'
		)
	}

	@test()
	protected static testTransformingValuesToValueTypes() {
		const schema = new SchemaEntity({
			id: 'is-array-transform',
			name: 'transform tests',
			fields: {
				name: {
					type: FieldType.Text,
					isArray: false,
					value: 'tay',
				},
				favoriteColors: {
					type: FieldType.Text,
					isArray: true,
					value: ['blue'],
				},
				favoriteNumber: {
					type: FieldType.Number,
				},
			},
		})

		// @ts-ignore
		schema.set('favoriteColors', [1, 2, 3])

		const favColors = schema.get('favoriteColors')
		assert.isEqualDeep(favColors, ['1', '2', '3'])

		// @ts-ignore
		schema.set('favoriteNumber', ['9', '8', '100'])
		const favNumber = schema.get('favoriteNumber')
		assert.isEqual(
			favNumber,
			9,
			'Schema did not transform array of strings to single number'
		)
	}

	@test('test typing against object literal maps correctly')
	protected static testValuesTypesAgainstObjectLiteral() {
		const values: {
			name: string
			onlyOnCar: string | undefined | null
		} = {
			name: 'test',
			onlyOnCar: null,
		}
		assert.isType<SchemaValues<typeof truckSchema>>(values)
	}

	@test('can type values correctly')
	protected static testFullValuesTypes() {
		const personEntity = new SchemaEntity(personSchema)
		const values = personEntity.getValues({ validate: false })
		const valuesWithoutInstances = personEntity.getValues({
			validate: false,
			createEntityInstances: false,
		})
		assert.isType<IPersonExpectedValues>(values)
		assert.isType<IPersonMappedValues>(values)
		assert.isType<IPersonExpectedValuesWithoutSchema>(valuesWithoutInstances)
	}

	@test('getting values using options by field')
	protected static testGettingOptionsByField() {
		const entity = new SchemaEntity(personSchema)
		entity.set('name', 'a really long name that should get truncated')
		const name = entity.get('name', { byField: { name: { maxLength: 10 } } })
		assert.isEqual(name, 'a really l')
	}
}
