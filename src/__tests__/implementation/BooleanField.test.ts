import BaseTest, { test, assert } from '@sprucelabs/test'
import { FieldDefinition } from '#spruce/schemas/fields/fields.types'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import FieldFactory from '../../factories/FieldFactory'
import { IBooleanFieldDefinition } from '../../fields/BooleanField.types'

export default class BooleanFieldTest extends BaseTest {
	@test('can transform string false to boolean false', 'false', false)
	@test('can transform string true to boolean true', 'true', true)
	@test('can transform gibberish to truthy', 'waka', true)
	@test('empty string is false', '', false)
	protected static async transformTests(value: any, expected: boolean) {
		const field = FieldFactory.Field('transformTest', {
			type: FieldType.Boolean,
		})
		const result = field.toValueType(value)
		assert.isEqual(result, expected)
	}

	@test()
	protected static canHandleDefaultValue() {
		const def: FieldDefinition = {
			label: 'Public',
			type: FieldType.Boolean,
			hint: 'Is this location viewable by guests?',
			defaultValue: false,
		}

		assert.isType<IBooleanFieldDefinition>(def)
	}

	@test()
	protected static canHandleArrayDefaultValue() {
		const def: FieldDefinition = {
			type: FieldType.Boolean,
			isArray: true,
			defaultValue: [true],
		}

		assert.isType<IBooleanFieldDefinition>(def)
	}
}
