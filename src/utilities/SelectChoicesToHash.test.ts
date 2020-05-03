import BaseTest, { test, assert } from '@sprucelabs/test'
import {
	SelectChoicesToHash,
	selectChoicesToHash,
	definitionChoicesToHash
} from './selectOptionsToHash'
import { personDefinition } from '../fields/__mocks__/personWithCars'
import { PickFieldNames } from '../schema.types'
import { FieldType } from '#spruce:schema/fields/fieldType'

export default class SelectOptionsToHashTest extends BaseTest {
	@test('choice hashing')
	protected static async testCreatingOptionHashes() {
		const options = personDefinition.fields.optionalSelect.options.choices

		type Test = SelectChoicesToHash<typeof options>
		const optionsHash = selectChoicesToHash(options)

		assert.expectType<Test>(optionsHash)
		assert.expectType<{ foo: 'Foo'; bar: 'Bar' }>(optionsHash)

		type SelectFields = PickFieldNames<
			typeof personDefinition,
			FieldType.Select
		>

		const optionsHash2 = definitionChoicesToHash(
			personDefinition,
			'optionalSelect'
		)

		const fieldName: SelectFields = 'anotherOptionalSelect'
		const fieldName2: SelectFields = 'optionalSelect'

		assert.expectType<'optionalSelect' | 'anotherOptionalSelect'>(fieldName)
		assert.expectType<'optionalSelect' | 'anotherOptionalSelect'>(fieldName2)

		assert.expectType<{ foo: 'Foo'; bar: 'Bar' }>(optionsHash2)
	}
}
