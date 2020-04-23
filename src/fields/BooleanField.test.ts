import BaseTest, { ISpruce, test, assert } from '@sprucelabs/test'
import { FieldFactory } from '..'
import { FieldType } from '#spruce:schema/fields/fieldType'

export default class TextFieldTest extends BaseTest {
	@test('can transform string false to boolean false', 'false', false)
	@test('can transform string true to boolean true', 'true', true)
	@test('can transform gibberish to truthy', 'waka', true)
	protected static async transformTests(
		spruce: ISpruce,
		value: any,
		expected: boolean
	) {
		const field = FieldFactory.field({ type: FieldType.Boolean })
		const result = field.toValueType(value)
		assert.equal(result, expected)
	}
}
