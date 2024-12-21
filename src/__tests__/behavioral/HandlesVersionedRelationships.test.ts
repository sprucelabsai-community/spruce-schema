import { test, assert } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import { StaticSchemaEntity } from '../../schemas.static.types'
import StaticSchemaEntityImpl from '../../StaticSchemaEntityImpl'
import buildVersionedPersonWithCars, {
    CarV2Definition,
} from '../data/versionedPersonWithCars'

export default class HandlesVersionedRelationshipsTest extends AbstractSchemaTest {
    @test()
    protected static async canGetV1AndV2OfARelatedField() {
        const { personV1Schema, personV2Schema, carV1Schema, carV2Schema } =
            buildVersionedPersonWithCars()

        assert.isEqual(personV1Schema.id, personV2Schema.id)

        assert.isEqual(personV1Schema.version, 'v1')
        assert.isEqual(personV2Schema.version, 'v2')

        assert.isEqual(carV1Schema.id, carV2Schema.id)

        assert.isEqual(carV1Schema.version, 'v1')
        assert.isEqual(carV2Schema.version, 'v2')
    }

    @test()
    protected static async throwsWhenMissingVersionInUnionFieldsIfMultipleNamesMatch() {
        const { personV2Schema, carV1Schema, carV2Schema } =
            buildVersionedPersonWithCars()

        const carV1 = new StaticSchemaEntityImpl(carV1Schema, {
            name: 'version 1',
        })
        const carV2 = new StaticSchemaEntityImpl(carV2Schema, {
            name: 'version 2',
            newRequiredOnCar: 'is required',
        })

        assert.isEqual(carV1.version, 'v1')
        assert.isEqual(carV2.version, 'v2')

        const person = new StaticSchemaEntityImpl(personV2Schema, {
            requiredCar: carV2.getValues(),
            optionalCarWithCallback: {
                id: 'car',
                values: carV1.getValues(),
            },
            optionalCarOrTruck: { id: 'car', values: carV2.getValues() },
        })

        assert.doesThrow(() => person.getValues(), /version/gi)
    }

    @test()
    protected static async canSetSchemaFieldToOneOfAFewVersions() {
        const { personV2Schema, carV1Schema, carV2Schema } =
            buildVersionedPersonWithCars()

        const carV1 = new StaticSchemaEntityImpl(carV1Schema, {
            name: 'version 1',
        })
        const carV2 = new StaticSchemaEntityImpl(carV2Schema, {
            name: 'version 2',
            newRequiredOnCar: 'is required',
        })

        assert.isEqual(carV1.version, 'v1')
        assert.isEqual(carV2.version, 'v2')

        const person = new StaticSchemaEntityImpl(personV2Schema, {
            requiredCar: carV2.getValues(),
            optionalCarWithCallback: {
                id: 'car',
                values: carV1.getValues(),
                version: carV1Schema.version,
            },
            optionalCarOrTruck: {
                id: 'car',
                values: carV2.getValues(),
                version: carV2Schema.version,
            },
            requiredIsArrayCars: [],
            requiredIsArrayCarOrTruck: [],
        })

        const values = person.getValues()
        assert.isTruthy(values)

        const car = person.get('optionalCarOrTruck')

        switch (car && car.schemaId) {
            case 'truck':
                assert.fail('should have resolved to car')
                break
            case 'car': {
                const values = (
                    car as StaticSchemaEntity<CarV2Definition>
                ).getValues()
                assert.isEqual(values.name, 'version 2')
            }
        }
    }
}
