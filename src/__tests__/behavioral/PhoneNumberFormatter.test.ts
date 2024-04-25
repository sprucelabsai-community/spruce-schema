import { test, assert } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import formatPhoneNumber, {
    isValidNumber,
} from '../../utilities/formatPhoneNumber'

export default class PhoneNumberFormatterTest extends AbstractSchemaTest {
    @test()
    protected static async passesWithNumbersForUs() {
        this.assertValidNumber('+1 555 555 5555')
        this.assertValidNumber('555 555 5555')
        this.assertValidNumber('+1 (555) 555 5555')
        this.assertValidNumber('1 555 555 5555')
    }

    @test()
    protected static async passesWithNumbersForTurkey() {
        this.assertValidNumber('+90 555 555 5555')
        this.assertValidNumber('90 555 555 5555')
        this.assertValidNumber('+90 (555) 555 5555')
        this.assertValidNumber('90 555 555 5555')
    }

    @test()
    protected static async passesWithNumbersForGermany() {
        this.assertValidNumber('+49 555 555 5555')
        this.assertValidNumber('49 555 555 5555')
        this.assertValidNumber('+49 (555) 555 5555')
        this.assertValidNumber('49 123 123 1234')
    }

    @test()
    protected static async formatsNumberInDifferentFormatsUs() {
        this.assertFormatsAsExpected('555 555 5555', '+1 555-555-5555')
        this.assertFormatsAsExpected('5555555555', '+1 555-555-5555')
        this.assertFormatsAsExpected('+1 (555) 555-5555', '+1 555-555-5555')
        this.assertFormatsAsExpected('+1 555 555-5555', '+1 555-555-5555')
        this.assertFormatsAsExpected('+1 (555)-555-5555', '+1 555-555-5555')
        this.assertFormatsAsExpected('+15555555555', '+1 555-555-5555')
        this.assertFormatsAsExpected('+1 (978) 505-2323', '+1 978-505-2323')
        this.assertFormatsAsExpected('805-555-5555', '+1 805-555-5555')
        this.assertFormatsAsExpected('905-555-5555', '+1 905-555-5555')
        this.assertFormatsAsExpected('905123', '+1 905-123')
        this.assertFormatsAsExpected('+1720', '+1 720')
        this.assertFormatsAsExpected('+1 72', '+1 72')
    }

    @test()
    protected static async formatsNumberInDifferentFormatsTurkey() {
        this.assertFormatsAsExpected('90 123 435 6789', '+90 123 435 6789')
        this.assertFormatsAsExpected('905555555555', '+90 555 555 5555')
        this.assertFormatsAsExpected('+90 (555) 555-5555', '+90 555 555 5555')
        this.assertFormatsAsExpected('+90 555 555-5555', '+90 555 555 5555')
        this.assertFormatsAsExpected('+90 (555)-555-5555', '+90 555 555 5555')
        this.assertFormatsAsExpected('+905555555555', '+90 555 555 5555')
        this.assertFormatsAsExpected('+90505', '+90 505')
        this.assertFormatsAsExpected('+90505 12', '+90 505 12')
    }

    @test()
    protected static async formatsNumberInDifferentFormatsGermanyWith10DigitNumber() {
        this.assertFormatsAsExpected('49 555 555 5555', '+49 555 555 5555')
        // this.assertFormatsAsExpected('495555555555', '+49 5555 555555')
        this.assertFormatsAsExpected('+49 (555) 555 5555', '+49 555 555 5555')
        this.assertFormatsAsExpected('49 123 123 1234', '+49 123 123 1234')
        this.assertFormatsAsExpected('+49 555 555-5555', '+49 555 555 5555')
        //this.assertFormatsAsExpected('+495555555555', '+49 5555 555555')
    }

    private static assertFormatsAsExpected(number: string, expected: string) {
        const actual = formatPhoneNumber(number)
        assert.isEqual(actual, expected)
    }

    private static assertValidNumber(number: string) {
        assert.isTrue(
            isValidNumber(number),
            `Number ${number} is not a valid phone number!`
        )
    }
}
