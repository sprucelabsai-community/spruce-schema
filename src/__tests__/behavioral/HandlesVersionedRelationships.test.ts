import { test, assert } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import Schema from '../../Schema'
import { ISchema } from '../../schemas.static.types'
import buildVersionedPersonWithCars, {
	ICarV2Definition
} from '../data/versionedPersonWithCars'

export default class HandlesVersionedRelationshipsTest extends AbstractSchemaTest {
	@test()
	protected static async canGetV1AndV2OfARelatedField() {
		const {
			personV1Definition,
			personV2Definition,
			carV1Definition,
			carV2Definition
		} = buildVersionedPersonWithCars()

		assert.isEqual(personV1Definition.id, personV2Definition.id)

		assert.isEqual(personV1Definition.version, 'v1')
		assert.isEqual(personV2Definition.version, 'v2')

		assert.isEqual(carV1Definition.id, carV2Definition.id)

		assert.isEqual(carV1Definition.version, 'v1')
		assert.isEqual(carV2Definition.version, 'v2')
	}

	@test()
	protected static async throwsWhenMissingVersionInUnionFields() {
		const {
			personV2Definition,
			carV1Definition,
			carV2Definition
		} = buildVersionedPersonWithCars()

		const carV1 = new Schema(carV1Definition, { name: 'version 1' })
		const carV2 = new Schema(carV2Definition, {
			name: 'version 2',
			newRequiredOnCar: 'is required'
		})

		assert.isEqual(carV1.version, 'v1')
		assert.isEqual(carV2.version, 'v2')

		const person = new Schema(personV2Definition, {
			requiredCar: carV2.getValues(),
			optionalCarWithCallback: { schemaId: 'car', values: carV1.getValues() },
			optionalCarOrTruck: { schemaId: 'car', values: carV2.getValues() }
		})

		assert.doesThrow(() => person.getValues(), /version/gi)
	}

	@test()
	protected static async canSetSchemaFieldToOneOfAFewVersions() {
		const {
			personV2Definition,
			carV1Definition,
			carV2Definition
		} = buildVersionedPersonWithCars()

		const carV1 = new Schema(carV1Definition, { name: 'version 1' })
		const carV2 = new Schema(carV2Definition, {
			name: 'version 2',
			newRequiredOnCar: 'is required'
		})

		assert.isEqual(carV1.version, 'v1')
		assert.isEqual(carV2.version, 'v2')

		const person = new Schema(personV2Definition, {
			requiredCar: carV2.getValues(),
			optionalCarWithCallback: {
				schemaId: 'car',
				version: carV1.version,
				values: carV1.getValues()
			},
			optionalCarOrTruck: {
				schemaId: 'car',
				version: carV2.version,
				values: carV2.getValues()
			}
		})

		const values = person.getValues()
		assert.isOk(values)

		const car = person.get('optionalCarOrTruck')

		switch (car && car.schemaId) {
			case 'truck':
				assert.fail('should have resolved to car')
				break
			case 'car': {
				const values = (car as ISchema<ICarV2Definition>).getValues()
				assert.isEqual(values.name, 'version 2')
			}
		}
	}
}
