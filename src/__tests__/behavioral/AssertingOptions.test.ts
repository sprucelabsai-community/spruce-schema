import { test, assert } from '@sprucelabs/test'
import { errorAssert } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import assertOptions from '../../utilities/assertOptions'

export default class AssertingOptionsTest extends AbstractSchemaTest {
	@test()
	protected static throwsWhenNotFound() {
		//@ts-ignore
		assert.doesThrow(() => assertOptions({}, ['hello']))
	}

	@test()
	protected static passeWithZero() {
		assertOptions({ hello: 0 }, ['hello'])
	}

	@test()
	protected static failsWithNull() {
		assert.doesThrow(() => assertOptions({ hello: null }, ['hello']))
	}

	@test('can pass through message 1', 'what the')
	@test('can pass through message 2', 'so much more')
	protected static passesThroughErrorMessage(msg: string) {
		//@ts-ignore
		assert.doesThrow(() => assertOptions({}, ['waka'], msg), msg)
	}

	@test()
	protected static typesResultsAsNonNullable() {
		type TestOptions = {
			passed?: boolean
			stillOptional?: boolean
			nested?: {
				hey?: string
			}
		}

		const options: TestOptions = {
			passed: true,
			stillOptional: false,
			nested: {
				hey: 'true',
			},
		}

		const { passed, stillOptional } = assertOptions(options, [
			'passed',
			'nested.hey',
		])

		assert.isExactType<boolean, typeof passed>(true)
		assert.isExactType<boolean | undefined, typeof stillOptional>(true)
	}

	@test(
		'finds nested 1',
		{
			HELLO: 'world',
		},
		['env.HELLO']
	)
	@test(
		'finds nested 2',
		{
			WHAT: 'the?',
		},
		['env.WHAT']
	)
	protected static passesWhenFindingNestedItems(
		expected: Record<string, any>,
		keys: string[]
	) {
		const options = {
			env: expected,
		}

		const actual = assertOptions(options, keys as any)

		assert.isEqualDeep(actual, options)
	}

	@test()
	protected static failsWithDotSyntaxedParams() {
		const err = assert.doesThrow(() =>
			//@ts-ignore
			assertOptions({ nested: { NO_GO: true } }, ['nested.YES_GO'])
		)

		errorAssert.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['nested.YES_GO'],
		})
	}
}
