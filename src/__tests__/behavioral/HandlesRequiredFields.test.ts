import { test, assert } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import StaticSchemaEntityImplementation from '../../StaticSchemaEntityImplementation'
import buildPersonWithCars from '../data/personWithCars'

export default class HandlesRequiredFieldsTest extends AbstractSchemaTest {
	@test()
	protected static async getsExpectedTypeBackFromOptionalFields() {
		const { carSchema } = buildPersonWithCars()
		const car = new StaticSchemaEntityImplementation(carSchema, {
			name: 'taco',
			onlyOnCar: 'bell',
		})

		const name = car.get('name')
		const onlyOnCar = car.get('onlyOnCar')

		assert.isType<string>(name)
		assert.isType<string | undefined | null>(onlyOnCar)
	}
}
