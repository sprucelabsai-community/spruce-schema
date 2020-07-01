import BaseTest, { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { FieldFactory } from '../..'

export default class BooleanFieldTest extends BaseTest {
	@test('can transform string false to boolean false', 'false', false)
	@test('can transform string true to boolean true', 'true', true)
	@test('can transform gibberish to truthy', 'waka', true)
	@test('empty string is false', '', false)
	protected static async transformTests(value: any, expected: boolean) {
		const field = FieldFactory.field('transformTest', {
			type: FieldType.Boolean
		})
		const result = field.toValueType(value)
		assert.isEqual(result, expected)
	}
}
