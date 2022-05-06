import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'

export default class ImageFieldTest extends AbstractSpruceTest {
	@test()
	protected static async canCreateImageField() {
		const imageField = new ImageField()
		assert.isTruthy(imageField)
	}

	@test()
	protected static async yourNextTest() {
		assert.isTrue(false)
	}
}

class ImageField {}
