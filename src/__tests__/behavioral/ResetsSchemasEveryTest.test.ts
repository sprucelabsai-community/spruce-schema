import { assert, test } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import Schema from '../../Schema'
import buildPersonWithCars from '../data/personWithCars'

export default class ResetsSchemasEveryTest extends AbstractSchemaTest {
	protected static async beforeEach() {
		await super.beforeEach()
		assert.isEqual(Schema.getTrackingCount(), 0)
	}

	@test()
	protected static importPersonWithCar() {
		assert.isEqual(Schema.getTrackingCount(), 0)
		buildPersonWithCars()
		assert.isAbove(Schema.getTrackingCount(), 0)
	}

	@test()
	protected static importPersonWithCarASecondTime() {
		assert.isEqual(Schema.getTrackingCount(), 0)
		buildPersonWithCars()
		assert.isAbove(Schema.getTrackingCount(), 0)
	}
}
