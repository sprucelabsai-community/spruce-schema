import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import FieldFactory from '../../factories/FieldFactory'
import { FieldDefinition } from '../../fields'
import { IBooleanFieldDefinition } from '../../fields/BooleanField.types'

export default class BooleanFieldTest extends AbstractSpruceTest {
	@test('can transform string false to boolean false', 'false', false)
	@test('can transform string true to boolean true', 'true', true)
	@test('can transform gibberish to truthy', 'waka', true)
	@test('empty string is false', '', false)
	protected static async transformTests(value: any, expected: boolean) {
		const field = FieldFactory.Field('transformTest', {
			type: 'boolean',
		})
		const result = field.toValueType(value)
		assert.isEqual(result, expected)
	}

	@test()
	protected static canHandleDefaultValue() {
		const def: FieldDefinition = {
			label: 'Public',
			type: 'boolean',
			hint: 'Is this location viewable by guests?',
			defaultValue: false,
		}

		assert.isType<IBooleanFieldDefinition>(def)
	}

	@test()
	protected static canHandleArrayDefaultValue() {
		const def: FieldDefinition = {
			type: 'boolean',
			isArray: true,
			defaultValue: [true],
		}

		assert.isType<IBooleanFieldDefinition>(def)
	}
}
