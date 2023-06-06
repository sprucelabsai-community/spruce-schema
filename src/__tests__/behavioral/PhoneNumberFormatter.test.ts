import { test, assert } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import { isValidNumber } from '../../utilities/formatPhoneNumber'

export default class PhoneNumberFormatterTest extends AbstractSchemaTest {
	@test()
	protected static async passesWithNumbersWithCountryCode() {
		this.assertValidNumber('+1 555 555 5555')
		this.assertValidNumber('555 555 5555')
		this.assertValidNumber('+1 (555) 555 5555')
		this.assertValidNumber('1 555 555 5555')
	}

	private static assertValidNumber(number: string) {
		assert.isTrue(isValidNumber(number))
	}
}
