import BaseTest, { ISpruce, test, assert } from '@sprucelabs/test'
import FieldFactory from './FieldFactory'
import { FieldDefinition } from '#spruce:schema/fields/fields.types'
import FieldType from '#spruce:schema/fields/fieldType'
import { ISelectFieldDefinitionChoice } from '../fields'

const choices: ISelectFieldDefinitionChoice[] = [
	{ value: 'foo', label: 'Foo' },
	{ value: 'bar', label: 'Bar' }
]

export default class TextFieldTest extends BaseTest {
	@test(
		'create select and get choices',
		{ type: FieldType.Select, options: { choices } },
		choices
	)
	protected static async transformTests(
		spruce: ISpruce,
		definition: FieldDefinition,
		expectedValue: any
	) {
		const field = FieldFactory.field('test', definition)
		switch (field.definition.type) {
			case FieldType.Select:
				assert.deepEqual(field.definition.options.choices, expectedValue)
				break
		}
	}
}
