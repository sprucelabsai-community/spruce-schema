import { assert, test } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import SchemaEntity from '../../SchemaEntity'
import buildPersonWithCars from '../data/personWithCars'

export default class ResetsSchemasEveryTest extends AbstractSchemaTest {
	protected static async beforeEach() {
		await super.beforeEach()
		assert.isEqual(SchemaEntity.getTrackingCount(), 0)
	}

	@test()
	protected static importPersonWithCar() {
		assert.isEqual(SchemaEntity.getTrackingCount(), 0)
		buildPersonWithCars()
		assert.isAbove(SchemaEntity.getTrackingCount(), 0)
	}

	@test()
	protected static importPersonWithCarASecondTime() {
		assert.isEqual(SchemaEntity.getTrackingCount(), 0)
		buildPersonWithCars()
		assert.isAbove(SchemaEntity.getTrackingCount(), 0)
	}
}
