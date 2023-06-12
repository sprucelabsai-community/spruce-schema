import { test, assert } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import formatPhoneNumber, {
	isValidNumber,
} from '../../utilities/formatPhoneNumber'

export default class PhoneNumberFormatterTest extends AbstractSchemaTest {
	@test()
	protected static async passesWithNumbersWithCountryCode() {
		this.assertValidNumber('+1 555 555 5555')
		this.assertValidNumber('555 555 5555')
		this.assertValidNumber('+1 (555) 555 5555')
		this.assertValidNumber('1 555 555 5555')
	}

	@test()
	protected static async formatsNumberInDifferentFormats() {
		this.assertFormatsAsExpected('555 555 5555', '+1 555-555-5555')
		this.assertFormatsAsExpected('5555555555', '+1 555-555-5555')
		this.assertFormatsAsExpected('+1 (555) 555-5555', '+1 555-555-5555')
		this.assertFormatsAsExpected('+1 555 555-5555', '+1 555-555-5555')
		this.assertFormatsAsExpected('+1 (555)-555-5555', '+1 555-555-5555')
		this.assertFormatsAsExpected('+15555555555', '+1 555-555-5555')
		this.assertFormatsAsExpected('+1 (978) 505-2323', '+1 978-505-2323')
	}

	private static assertFormatsAsExpected(number: string, expected: string) {
		const actual = formatPhoneNumber(number)
		assert.isEqual(actual, expected)
	}

	private static assertValidNumber(number: string) {
		assert.isTrue(isValidNumber(number))
	}
}
