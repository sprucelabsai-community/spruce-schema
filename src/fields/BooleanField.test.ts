import '../addons/paths.addon'
import BaseTest, { ISpruce, test } from '@sprucelabs/test'
import { ExecutionContext } from 'ava'
import { FieldFactory } from '..'
import { FieldType } from '#spruce:schema/fields/fieldType'

/** Context just for this test */
interface IContext {}

export default class TextFieldTest extends BaseTest {
	@test('can transform string false to boolean false', 'false', false)
	@test('can transform string true to boolean true', 'true', true)
	@test('can transform gibberish to truthy', 'waka', true)
	protected static async transformTests(
		t: ExecutionContext<IContext>,
		spruce: ISpruce,
		value: any,
		expected: boolean
	) {
		const field = FieldFactory.field({ type: FieldType.Boolean })
		const result = field.toValueType(value)
		t.is(result, expected)
	}
}
