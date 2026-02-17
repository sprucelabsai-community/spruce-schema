import { test, assert } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import DynamicSchemaEntityImplementation from '../../DynamicSchemaEntityImplementation'
import EntityFactory from '../../factories/SchemaEntityFactory'
import StaticSchemaEntityImpl from '../../StaticSchemaEntityImpl'

export default class CreatingEntityInstancesTest extends AbstractSchemaTest {
    @test()
    protected static async canCreateStaticEntity() {
        const instance = EntityFactory.Entity({
            id: 'staticPerson',
            fields: {
                firstName: {
                    type: 'text',
                    isRequired: true,
                },
            },
        })

        assert.isTrue(instance instanceof StaticSchemaEntityImpl)
    }

    @test()
    protected static async typesStaticEntity() {
        const instance = EntityFactory.Entity(
            {
                id: 'staticPerson',
                fields: {
                    firstName: {
                        type: 'text',
                        isRequired: true,
                    },
                },
            },
            {
                firstName: 'Tay tay',
            }
        )

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const values = instance.getValues()

        assert.isExactType<typeof values, { firstName: string }>(true)
    }

    @test()
    protected static async canCreateDynamicEntity() {
        const instance = EntityFactory.Entity({
            id: 'staticPerson',
            dynamicFieldSignature: {
                type: 'boolean',
                keyName: 'key',
            },
        })

        assert.isTrue(instance instanceof DynamicSchemaEntityImplementation)
    }

    @test()
    protected static async typesDynamicEntity() {
        const instance = EntityFactory.Entity(
            {
                id: 'staticPerson',
                dynamicFieldSignature: {
                    type: 'boolean',
                    keyName: 'key',
                },
            },
            {
                pass: true,
                youSure: false,
            }
        )

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const values = instance.getValues()

        assert.isExactType<
            typeof values,
            Record<string, boolean | undefined | null>
        >(true)
    }

    @test()
    protected static async valuesSetToEntityOverwriteValuesInSchema() {
        const i = EntityFactory.Entity(
            {
                id: 'testPerson',
                fields: {
                    firstName: {
                        type: 'text',
                        value: 'hey!',
                    },
                },
            },
            {
                firstName: 'banana',
            }
        )

        assert.isEqual(i.get('firstName'), 'banana')
    }
}
