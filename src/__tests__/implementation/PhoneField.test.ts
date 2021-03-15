import AbstractSpruceTest, { assert, test } from '@sprucelabs/test'
import FieldFactory from '../../factories/FieldFactory'
import formatPhoneNumber from '../../utilities/formatPhoneNumber'

export class PhoneFieldTest extends AbstractSpruceTest {
	@test('can handle dummy number', '1-555-555-5555', [])
	@test('optional handles null phone', null, [])
	@test('optional handles undefined phone', undefined, [])
	@test('can handle dummy number without country code', '555-555-5555', [])
	@test('can handle dummy number with country code +', '+1 555-555-5555', [])
	@test(
		'can handle dummy number with country code and hyphen',
		'+1-555-555-5555',
		[]
	)
	@test('fails with bad number', '234th2s34th', [
		{
			code: 'invalid_value',
			name: 'phone',
		},
	])
	@test('fails with bad number with country', '+1 234th2s34th', [
		{
			code: 'invalid_value',
			name: 'phone',
		},
	])
	@test(
		'required fails with empty string for a number',
		'',
		[{ code: 'missing_required', name: 'phone' }],
		true
	)
	@test('passes with good number', '720-253-5555', [])
	@test('passes with good number with country', '+1720-253-5555', [])
	@test('passes with good number with country formatted', '+1 720-253-5555', [])
	@test(
		'passes with good number with country formatted hyphen',
		'+1-720-253-5555',
		[]
	)
	protected static validate(phone: string, expected: any, isRequired = false) {
		const field = FieldFactory.Field('phone', {
			type: 'phone',
			isRequired,
		})

		const errors = field.validate(phone)
		assert.doesInclude(errors, expected)
	}

	@test('formats 720-233-2355', '720-233-2355', '+1 720-233-2355')
	@test('formats 7202332355', '7202332355', '+1 720-233-2355')
	@test('formats 720 233 2355', '720 233 2355', '+1 720-233-2355')
	@test('formats 1720 233 2355', '1720 233 2355', '+1 720-233-2355')
	@test('formats +1-720-233-2355', '+1-720-233-2355', '+1 720-233-2355')
	protected static format(phone: string, expected: string) {
		const field = FieldFactory.Field('phone', {
			type: 'phone',
		})

		const actual = field.toValueType(phone)
		assert.isEqual(actual, expected)
	}

	@test()
	protected static failingFormattingWithFailSilentReturnsOriginalNumber() {
		const formatted = formatPhoneNumber('aoeuaoue', true)
		assert.isEqual(formatted, 'aoeuaoue')
	}

	@test()
	protected static failSilentlyFalseThrows() {
		const err = assert.doesThrow(() => formatPhoneNumber('aoeuaoue', false))
		assert.isTruthy(err)
		assert.isTruthy(err.message, 'INVALID_PHONE_NUMBER')
	}
}
