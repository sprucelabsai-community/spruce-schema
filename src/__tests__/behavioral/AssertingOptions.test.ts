import { test, assert } from '@sprucelabs/test'
import { assertOptions } from '../..'
import AbstractSchemaTest from '../../AbstractSchemaTest'

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
}
