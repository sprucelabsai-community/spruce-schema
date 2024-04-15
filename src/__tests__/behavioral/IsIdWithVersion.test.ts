import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import isIdWithVersion from '../../utilities/isIdWithVersion'

export default class IsIdWithVersionTest extends AbstractSpruceTest {
    @test()
    protected static async isIdWithVersion() {
        assert.isTrue(isIdWithVersion({ id: 'test', version: 'hey' }))
        assert.isFalse(isIdWithVersion({ id: 'test', fields: {} }))
        assert.isFalse(
            //@ts-ignore
            isIdWithVersion({ id: 'test', dynamicFieldSignature: {} })
        )
    }
}
