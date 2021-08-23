import { test, assert } from '@sprucelabs/test'
import StaticSchemaEntityImplementation from '../..'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import {
	SchemaPublicFieldNames,
	SchemaPublicValues,
} from '../../schemas.static.types'
import normalizeSchemaValues from '../../utilities/normalizeSchemaValues'
import buildPersonWithCars, { CarSchema } from '../data/personWithCars'

const { carSchema } = buildPersonWithCars()

export default class HandlesHidingPrivateFieldsTest extends AbstractSchemaTest {
	@test()
	protected static typeMappingFieldNamesWorks() {
		let fieldName: SchemaPublicFieldNames<CarSchema> | undefined

		assert.isExactType<typeof fieldName, 'name' | 'onlyOnCar' | undefined>(true)
	}

	@test()
	protected static typeMappingValuesWorks() {
		type WithPublicValues = SchemaPublicValues<CarSchema>
		const person = {
			name: 'cool car',
		} as WithPublicValues

		assert.isTruthy(person)
		assert.isExactType<typeof person, { name: string }>(true)
	}

	@test()
	protected static async schemaCanDropPrivateFields() {
		const entity = new StaticSchemaEntityImplementation(carSchema, {
			name: 'cool car',
			privateField: 'Go away!',
		})

		const values = entity.getValues({ shouldIncludePrivateFields: false })

		//@ts-ignore
		assert.isFalsy(values.privateField)
		assert.isExactType<typeof values, { name: string }>(true)
	}

	@test()
	protected static async schemaCanKeepPrivateFields() {
		const entity = new StaticSchemaEntityImplementation(carSchema, {
			name: 'cool car',
			privateField: 'Go away!',
		})

		const values = entity.getValues({ shouldIncludePrivateFields: true })

		assert.isExactType<
			typeof values,
			{
				name: string
				privateField: string | undefined | null
				onlyOnCar: string | undefined | null
			}
		>(true)
	}

	@test()
	protected static async schemaCanDropPrivateFieldsWhenSelectingFields() {
		const entity = new StaticSchemaEntityImplementation(carSchema, {
			name: 'cool car',
			privateField: 'Go away!',
			onlyOnCar: 'yay',
		})

		const values = entity.getValues({
			shouldIncludePrivateFields: false,
			fields: ['onlyOnCar'],
		})

		//@ts-ignore
		assert.isFalsy(values.privateField)
		assert.isExactType<
			typeof values,
			{ onlyOnCar?: string | undefined | null }
		>(true)
	}

	@test()
	protected static normalizeCanDropPrivateFields() {
		const values = normalizeSchemaValues(
			carSchema,
			{ name: 'sweet!', privateField: 'go away' },
			{ shouldIncludePrivateFields: false }
		)

		//@ts-ignore
		assert.isFalsy(values.privateField)
		assert.isExactType<
			typeof values,
			{ name: string; onlyOnCar?: string | undefined | null }
		>(true)
	}

	@test()
	protected static normalizeCanKeepPrivateFields() {
		const values = normalizeSchemaValues(
			carSchema,
			{ name: 'sweet!', privateField: 'go away' },
			{ shouldIncludePrivateFields: true }
		)

		assert.isEqual(values.privateField, 'go away')
		assert.isExactType<
			typeof values,
			{
				name: string
				onlyOnCar: string | undefined | null
				privateField: string | undefined | null
			}
		>(true)
	}

	@test()
	protected static dropsPrivateFieldsWhileSelectingFields() {
		const values = normalizeSchemaValues(
			carSchema,
			{ name: 'sweet!', privateField: 'go away', onlyOnCar: 'vroom' },
			{ shouldIncludePrivateFields: false, fields: ['onlyOnCar'] }
		)

		assert.isExactType<
			typeof values,
			{ onlyOnCar?: string | null | undefined }
		>(true)
	}
}
