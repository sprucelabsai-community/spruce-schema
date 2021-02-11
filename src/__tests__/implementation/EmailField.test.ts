import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import FieldFactory from '../../factories/FieldFactory'

export default class EmailFieldTest extends AbstractSpruceTest {
	@test('fails with obviously bad email', 'email', [
		{ code: 'invalid_value', name: 'testField' },
	])
	@test('fails with barely bad email', 'email@email', [
		{ code: 'invalid_value', name: 'testField' },
	])
	@test('passes with .com email', 'email@email.com', [])
	@test('passes with .ai email', 'email@email.ai', [])
	@test('passes with .eu email', 'email@email.eu', [])
	protected static async transformTests(email: any, expected: any) {
		const field = FieldFactory.Field('testField', {
			type: 'email',
		})

		const errors = field.validate(email)
		assert.isEqualDeep(errors, expected)
	}
}
