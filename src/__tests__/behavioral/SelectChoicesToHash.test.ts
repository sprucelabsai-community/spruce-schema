import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { PickFieldNames } from '../../schemas.static.types'
import {
	SelectChoicesToHash,
	selectChoicesToHash,
	schemaChoicesToHash,
} from '../../utilities/selectChoicesToHash'
import buildPersonWithCars from '../data/personWithCars'

export default class SelectOptionsToHashTest extends AbstractSpruceTest {
	@test()
	protected static async testCreatingOptionHashes() {
		const { personSchema } = buildPersonWithCars()
		const options = personSchema.fields.optionalSelect.options.choices

		type Test = SelectChoicesToHash<typeof options>
		const optionsHash = selectChoicesToHash(options)

		assert.isType<Test>(optionsHash)
		assert.isType<{ foo: 'Foo'; bar: 'Bar' }>(optionsHash)
		assert.isEqualDeep(optionsHash, { foo: 'Foo', bar: 'Bar' })

		type SelectFields = PickFieldNames<typeof personSchema, 'select'>

		const optionsHash2 = schemaChoicesToHash(personSchema, 'optionalSelect')

		const optionsHash3 = schemaChoicesToHash(
			personSchema,
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

		assert.isType<{ foo: 'Foo'; bar: 'Bar' }>(optionsHash2)
		assert.isEqualDeep(optionsHash2, { foo: 'Foo', bar: 'Bar' })

		assert.isType<{ hello: 'world'; goodbye: 'darling' }>(optionsHash3)
		assert.isEqualDeep(optionsHash3, { hello: 'world', goodbye: 'darling' })
	}
}
