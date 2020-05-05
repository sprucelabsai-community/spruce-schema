import BaseTest, { test, assert } from '@sprucelabs/test'
import {
	SelectChoicesToHash,
	selectChoicesToHash,
	definitionChoicesToHash
} from './selectChoicesToHash'
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
		assert.expectType<{ Foo: 'foo'; Bar: 'bar' }>(optionsHash)

		type SelectFields = PickFieldNames<
			typeof personDefinition,
			FieldType.Select
		>

		const optionsHash2 = definitionChoicesToHash(
			personDefinition,
			'optionalSelect'
		)

		const optionsHash3 = definitionChoicesToHash(
			personDefinition,
			'optionalSelectWithDefaultValue'
		)

		const fieldName: SelectFields = 'optionalSelectWithDefaultValue'
		const fieldName2: SelectFields = 'optionalSelect'

		assert.expectType<'optionalSelect' | 'optionalSelectWithDefaultValue'>(
			fieldName
		)
		assert.expectType<'optionalSelect' | 'optionalSelectWithDefaultValue'>(
			fieldName2
		)

		assert.expectType<{ Foo: 'foo'; Bar: 'bar' }>(optionsHash2)
		assert.expectType<{ world: 'hello'; darling: 'goodbye' }>(optionsHash3)
	}
}
