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
}
