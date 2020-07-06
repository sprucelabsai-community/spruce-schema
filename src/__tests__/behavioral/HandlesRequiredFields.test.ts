import { test, assert } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import Schema from '../../Schema'
import buildPersonWithCars from '../data/personWithCars'

export default class HandlesRequiredFieldsTest extends AbstractSchemaTest {
	@test()
	protected static async getsExpectedTypeBackFromOptionalFields() {
		const { carDefinition } = buildPersonWithCars()
		const car = new Schema(carDefinition, {
			name: 'taco',
			onlyOnCar: 'bell',
		})

		const name = car.get('name')
		const onlyOnCar = car.get('onlyOnCar')

		assert.isType<string>(name)
		assert.isType<string | undefined | null>(onlyOnCar)
	}
}
