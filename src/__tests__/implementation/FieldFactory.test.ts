import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import FieldFactory from '../../factories/FieldFactory'
import { SelectFieldDefinitionChoice } from '../../fields/SelectField.types'

const choices: SelectFieldDefinitionChoice[] = [
	{ value: 'foo', label: 'Foo' },
	{ value: 'bar', label: 'Bar' },
]

export default class TextFieldTest extends AbstractSpruceTest {
	@test()
	protected static async buildSelectField() {
		const field = FieldFactory.Field('test', {
			type: 'select',
			options: { choices },
		})

		assert.isEqualDeep(field.definition.options.choices, choices)
	}
}
