import BaseTest, { test, assert } from '@sprucelabs/test'
import { PickFieldNames } from '../../schema.types'
import {
	SelectChoicesToHash,
	selectChoicesToHash,
	definitionChoicesToHash
} from '../../utilities/selectChoicesToHash'
import buildPersonWithCars from '../data/personWithCars'
import FieldType from '#spruce:schema/fields/fieldType'

export default class SelectOptionsToHashTest extends BaseTest {
	@test('choice hashing')
	protected static async testCreatingOptionHashes() {
		const { personDefinition } = buildPersonWithCars()
		const options = personDefinition.fields.optionalSelect.options.choices

		type Test = SelectChoicesToHash<typeof options>
		const optionsHash = selectChoicesToHash(options)

		assert.isType<Test>(optionsHash)
		assert.isType<{ Foo: 'foo'; Bar: 'bar' }>(optionsHash)

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

		assert.isType<'optionalSelect' | 'optionalSelectWithDefaultValue'>(
			fieldName
		)
		assert.isType<'optionalSelect' | 'optionalSelectWithDefaultValue'>(
			fieldName2
		)

		assert.isType<{ Foo: 'foo'; Bar: 'bar' }>(optionsHash2)
		assert.isType<{ world: 'hello'; darling: 'goodbye' }>(optionsHash3)
	}
}
