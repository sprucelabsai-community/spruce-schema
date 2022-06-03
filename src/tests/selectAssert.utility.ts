import { assert } from '@sprucelabs/test'
import { SelectChoice } from '../fields/SelectField.types'

const selectAssert = {
	assertSelectChoicesMatch<
		Choice extends SelectChoice,
		Values extends Choice['value'][number] = Choice['value'][number]
	>(choices: Choice[], expected: Values[]) {
		assert.isEqual(
			choices.length,
			expected.length,
			`Expected ${expected.length} choices, but found ${choices.length}!`
		)

		const actualValues = choices.map((c) => c.value)

		actualValues.sort()
		expected.sort()

		assert.isEqualDeep(
			actualValues,
			expected as any,
			`The options you sent don't match!`
		)
	},
}

export default selectAssert
