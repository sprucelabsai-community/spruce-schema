import { test, assert } from '@sprucelabs/test-utils'
import FieldFactory from '../../factories/FieldFactory'
import DateTimeField from '../../fields/DateTimeField'
import { DateTimeFieldDefinition } from '../../fields/DateTimeField.types'
import { SchemaValues } from '../../schemas.static.types'
import StaticSchemaEntityImpl from '../../StaticSchemaEntityImpl'
import AbstractDateFieldTest from '../../tests/AbstractDateFieldTest'
import buildSchema from '../../utilities/buildSchema'
import normalizeSchemaValues from '../../utilities/normalizeSchemaValues'

const schemaWithIsoDate = buildSchema({
	id: 'dateTestIso',
	fields: {
		optionalBirthday: {
			type: 'dateTime',
		},
		optionalAnniversary: {
			type: 'dateTime',
		},
		requiredBirthday: {
			type: 'dateTime',
			isRequired: true,
		},
		isoDate: {
			type: 'dateTime',
			options: {
				dateTimeFormat: 'iso_8601',
			},
		},
	},
})

type SchemaWithIso = typeof schemaWithIsoDate
type ValuesWithIso = SchemaValues<SchemaWithIso>

const schemaWithoutIsoDate = buildSchema({
	id: 'dateTest',
	fields: {
		optionalBirthday: {
			type: 'dateTime',
		},
		optionalAnniversary: {
			type: 'dateTime',
		},
		requiredBirthday: {
			type: 'dateTime',
			isRequired: true,
		},
		isoDate: {
			type: 'dateTime',
		},
	},
})

export default class DateFieldTest extends AbstractDateFieldTest {
	protected static schema = schemaWithIsoDate
	protected static entity: StaticSchemaEntityImpl<SchemaWithIso>
	private static field: DateTimeField

	protected static async beforeEach() {
		await super.beforeEach()
		this.field = DateFieldTest.Field()
	}

	@test()
	protected static canSetDateAsDateObject() {
		super.canSetDateAsDateObject()
	}

	@test('fails when setting to string 1', 'optionalBirthday', 'taco')
	@test('fails when setting to string 2', 'optionalAnniversary', 'bravo')
	@test('fails when setting to boolean 1', 'optionalAnniversary', true)
	protected static failsValidationIfPassedString(fieldName: any, value: any) {
		super.failsValidationIfPassedString(fieldName, value)
	}

	@test('can set to date')
	protected static turnsDatesIntoNumbers() {
		const date = new Date()

		//@ts-ignore
		this.entity.set('optionalAnniversary', date)

		//@ts-ignore
		assert.isEqual(this.entity.get('optionalAnniversary'), date.getTime())
	}

	@test()
	protected static nullAndUndefinedPersist() {
		assert.isNull(this.field.toValueType(null))
	}

	@test()
	protected static async canSetToKeepDatesInIsoFormat() {
		this.field = this.Field({
			dateTimeFormat: 'iso_8601',
		})

		const date = new Date()

		assert.isEqual(this.field.toValueType(date), date.toISOString())
		assert.isEqual(this.field.toValueType(date.getTime()), date.toISOString())
		assert.isEqual(
			this.field.toValueType(date.toISOString()),
			date.toISOString()
		)
		const errs = this.field.validate(date.toISOString())
		assert.isLength(errs, 0)
	}

	@test()
	protected static async canHandleIosDateUsingEntity() {
		const date = new Date()
		const entity = new StaticSchemaEntityImpl(schemaWithIsoDate, {
			isoDate: date.getTime(),
		})

		const isoDate = entity.get('isoDate')
		//@ts-ignore
		assert.isEqual(isoDate, date.toISOString())
	}

	@test()
	protected static async normalizingValuesBasedOnSchemaReturnsConsistentResults() {
		const values: ValuesWithIso = {
			isoDate: new Date().getTime(),
			optionalAnniversary: new Date().getTime(),
			optionalBirthday: new Date().getTime(),
			requiredBirthday: new Date().getTime(),
		}

		const normalized1 = normalizeSchemaValues(schemaWithIsoDate, values)
		const normalized2 = normalizeSchemaValues(schemaWithIsoDate, normalized1)

		assert.isEqualDeep(normalized1, normalized2)

		const normalizedWithoutIso = normalizeSchemaValues(
			schemaWithoutIsoDate,
			normalized1
		)

		assert.isEqualDeep(values, normalizedWithoutIso)
	}

	private static Field(
		options?: DateTimeFieldDefinition['options']
	): DateTimeField {
		return FieldFactory.Field('optionalBirthday', {
			type: 'dateTime',
			options,
		}) as DateTimeField
	}
}
