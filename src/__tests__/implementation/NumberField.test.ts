import { test, assert } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import FieldFactory from '../../factories/FieldFactory'

export default class NumberFieldTest extends AbstractSchemaTest {
	@test('non-string characters fails', 'aoeuaoeu', false)
	@test('number passes', 4, true)
	@test('string as number passes', '4', true)
	@test('null passes when not required', null, true)
	@test('undefined passes when not required', undefined, true)
	protected static async numberFieldErrorsWhenValueNaN(
		input: string,
		shouldPass: boolean
	) {
		const field = FieldFactory.Field('test', {
			type: 'number',
		})

		const errs = field.validate(input)

		if (shouldPass) {
			assert.isEqual(errs.length, 0)
		} else {
			assert.isAbove(errs.length, 0)
			assert.doesInclude(errs[0], { code: 'INVALID_PARAMETER' })
		}
	}

	@test('string number transformed to number', '4', 4)
	protected static async convertsThingsToNumbers(input: any, expected: number) {
		const field = FieldFactory.Field('test', {
			type: 'number',
		})

		const actual = field.toValueType(input)

		assert.isEqual(actual, expected)
	}
}
