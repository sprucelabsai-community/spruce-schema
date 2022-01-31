import { test, assert } from '@sprucelabs/test'
import StaticSchemaEntityImplementation, { buildSchema } from '../..'
import AbstractDateFieldTest from '../../tests/AbstractDateFieldTest'
import getStartOfDay from '../../utilities/getStartOfDay'

const schema = buildSchema({
	id: 'dateTest',
	fields: {
		optionalBirthday: {
			type: 'date',
		},
		optionalAnniversary: {
			type: 'date',
		},
		requiredBirthday: {
			type: 'date',
			isRequired: true,
		},
	},
})

type Schema = typeof schema

export default class DateFieldTest extends AbstractDateFieldTest {
	protected static entity: StaticSchemaEntityImplementation<Schema>
	protected static schema = schema

	@test()
	protected static canSetDateAsDateObject() {
		super.canSetDateAsDateObject()
	}

	@test('can set number to start of day', new Date().getTime())
	@test('can set date to start of day', new Date())
	protected static settingGetsToStartOfDay(date: any) {
		this.entity.set('optionalBirthday', date)

		const actual = this.entity.get('optionalBirthday')

		assert.isEqual(actual, getStartOfDay(date))
	}

	@test('fails when setting to string 1', 'optionalBirthday', 'taco')
	@test('fails when setting to string 2', 'optionalAnniversary', 'bravo')
	@test('fails when setting to boolean 1', 'optionalAnniversary', true)
	protected static failsValidationIfPassedString(fieldName: any, value: any) {
		super.failsValidationIfPassedString(fieldName, value)
	}

	@test()
	protected static honorsRequired() {
		super.honorsRequired()
	}
}
