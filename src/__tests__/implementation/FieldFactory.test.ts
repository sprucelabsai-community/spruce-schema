import BaseTest, { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import FieldFactory from '../../factories/FieldFactory'
import { ISelectFieldDefinitionChoice } from '../../fields/SelectField.types'

const choices: ISelectFieldDefinitionChoice[] = [
	{ value: 'foo', label: 'Foo' },
	{ value: 'bar', label: 'Bar' },
]

export default class TextFieldTest extends BaseTest {
	@test()
	protected static async buildSelectField() {
		const field = FieldFactory.Field('test', {
			type: FieldType.Select,
			options: { choices },
		})

		assert.isEqualDeep(field.definition.options.choices, choices)
	}
}
