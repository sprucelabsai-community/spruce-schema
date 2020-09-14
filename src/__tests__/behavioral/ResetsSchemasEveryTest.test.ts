import { assert, test } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import buildPersonWithCars from '../data/personWithCars'

export default class ResetsSchemasEveryTest extends AbstractSchemaTest {
	protected static async beforeEach() {
		await super.beforeEach()
		assert.isEqual(this.registry.getTrackingCount(), 0)
	}

	@test()
	protected static importPersonWithCar() {
		assert.isEqual(this.registry.getTrackingCount(), 0)
		buildPersonWithCars()
		assert.isEqual(this.registry.getTrackingCount(), 6)
	}

	@test()
	protected static importPersonWithCarASecondTime() {
		assert.isEqual(this.registry.getTrackingCount(), 0)
		buildPersonWithCars()

		assert.isEqual(this.registry.getTrackingCount(), 6)
	}
}
