import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import isIdWithVersion from '../../utilities/isIdWithVersion'

export default class IsIdWithVersionTest extends AbstractSpruceTest {
	@test()
	protected static async isIdWithVersion() {
		assert.isTrue(isIdWithVersion({ id: 'test', version: 'hey' }))
		assert.isFalse(isIdWithVersion({ id: 'test', fields: {} }))
		//@ts-ignore
		assert.isFalse(isIdWithVersion({ id: 'test', dynamicFieldSignature: {} }))
	}
}
