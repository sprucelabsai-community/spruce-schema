import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import selectAssertUtil from '../../tests/selectAssert.utility'

export default class AssertingSelectOptionsTest extends AbstractSpruceTest {
	@test()
	protected static canCreateAssertSelectOptions() {
		assert.isFunction(selectAssertUtil.assertSelectChoicesMatch)
	}

	@test(
		'throws if single option does not match',
		[
			{
				value: 'hello',
				label: 'World!',
			},
		],
		['no']
	)
	@test(
		'throws if choices outnumber expected does not match',
		[
			{
				value: 'hello',
				label: 'World!',
			},
			{
				value: 'no',
				label: 'way!',
			},
		],
		['no']
	)
	@test(
		'throws if not all choices match',
		[
			{
				value: 'hello',
				label: 'World!',
			},
			{
				value: 'no',
				label: 'way!',
			},
		],
		['no', 'word']
	)
	protected static knowsIfChoicesDontMatch(choices: any, expected: any) {
		assert.doesThrow(() =>
			selectAssertUtil.assertSelectChoicesMatch(choices, expected)
		)
	}

	@test(
		'matches single choices',
		[
			{
				value: 'hello',
				label: 'World!',
			},
		],
		['hello']
	)
	@test(
		'matches in order',
		[
			{
				value: 'hello',
				label: 'World!',
			},
			{
				value: 'no',
				label: 'Way',
			},
		],
		['hello', 'no']
	)
	@test(
		'matches out of order',
		[
			{
				value: 'hello',
				label: 'World!',
			},
			{
				value: 'no',
				label: 'Way',
			},
		],
		['no', 'hello']
	)
	protected static knowsIfSingeOptionMatches(options: any, expected: any) {
		selectAssertUtil.assertSelectChoicesMatch(options, expected)
	}

	@test('is typed correctly (will always pass)')
	protected static canType() {
		selectAssertUtil.assertSelectChoicesMatch(
			[
				{
					value: 'hello',
					label: 'World!',
				},
				{
					value: 'no',
					label: 'Way',
				},
			],
			['hello', 'no']
		)
	}
}
