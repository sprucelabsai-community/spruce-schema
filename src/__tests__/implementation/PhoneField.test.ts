import AbstractSpruceTest, { assert, test } from '@sprucelabs/test'
import FieldFactory from '../../factories/FieldFactory'

export class PhoneFieldTest extends AbstractSpruceTest {
	@test('can handle dummy number', '1-555-555-5555', [])
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
	@test('passes with good number', '720-253-5555', [])
	@test('passes with good number with country', '+1720-253-5555', [])
	@test('passes with good number with country formatted', '+1 720-253-5555', [])
	@test(
		'passes with good number with country formatted hyphen',
		'+1-720-253-5555',
		[]
	)
	protected static phoneFieldNumberChecks(phone: string, expected: any) {
		const field = FieldFactory.Field('phone', {
			type: 'phone',
		})

		const errors = field.validate(phone)
		assert.isEqualDeep(errors, expected)
	}
}
