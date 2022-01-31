import { test, assert } from '@sprucelabs/test'
import StaticSchemaEntityImplementation, { buildSchema } from '../..'
import AbstractDateFieldTest from '../../tests/AbstractDateFieldTest'

const schema = buildSchema({
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
	},
})

type Schema = typeof schema

export default class DateFieldTest extends AbstractDateFieldTest {
	protected static schema = schema
	protected static entity: StaticSchemaEntityImplementation<Schema>

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
}
