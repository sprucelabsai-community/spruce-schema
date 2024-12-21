import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import {
    Schema,
    SchemaDefaultValues,
    StaticSchemaEntity,
    SchemaValues,
    SchemaFieldNamesWithDefaultValue,
} from '../../schemas.static.types'
import StaticSchemaEntityImpl from '../../StaticSchemaEntityImpl'
import buildSchema from '../../utilities/buildSchema'
import defaultSchemaValues from '../../utilities/defaultSchemaValues'
import buildPersonWithCars, {
    PersonSchema,
    CarSchema,
    TruckSchema,
} from '../data/personWithCars'

StaticSchemaEntityImpl.enableDuplicateCheckWhenTracking = false

type PersonMappedDefaultValues = SchemaDefaultValues<PersonSchema, true>

interface PersonExpectedDefaultValues {
    optionalSelectWithDefaultValue: 'hello' | 'goodbye'
    optionalTextWithDefaultValue: string
    optionalIsArrayCarOrTruckWithDefaultValue: (
        | StaticSchemaEntity<CarSchema>
        | StaticSchemaEntity<TruckSchema>
    )[]
    optionalCarOrTruckWithDefaultValue:
        | StaticSchemaEntity<CarSchema>
        | StaticSchemaEntity<TruckSchema>
}

interface PersonExpectedDefaultValuesWithoutSchema {
    optionalSelectWithDefaultValue: 'hello' | 'goodbye'
    optionalTextWithDefaultValue: string
    optionalIsArrayCarOrTruckWithDefaultValue: {
        id: 'car' | 'truck'
        values: SchemaValues<CarSchema> | SchemaValues<TruckSchema>
    }[]
    optionalCarOrTruckWithDefaultValue: {
        id: 'car' | 'truck'
        values: SchemaValues<CarSchema> | SchemaValues<TruckSchema>
    }
}

// we don't need these registered
const { personSchema, carSchema } = buildPersonWithCars()

export default class SchemaDefaultValuesTest extends AbstractSpruceTest {
    @test(
        'Test typing on default values (test will always pass, lint will fail)'
    )
    protected static textAndSelectDefaultValues() {
        let fieldName:
            | SchemaFieldNamesWithDefaultValue<typeof personSchema>
            | undefined

        // make sure types are 100% (only works if they are currently undefined)
        assert.isType<
            | 'optionalSelectWithDefaultValue'
            | 'optionalTextWithDefaultValue'
            | 'optionalCarWithDefaultValue'
            | 'optionalIsArrayCarOrTruckWithDefaultValue'
            | 'optionalCarOrTruckWithDefaultValue'
            | undefined
        >(fieldName)
    }

    @test('Gets default values while creating schema instances', personSchema, {
        optionalCarWithDefaultValue: new StaticSchemaEntityImpl(carSchema, {
            name: 'fast car',
        }),
        optionalSelectWithDefaultValue: 'hello',
        optionalTextWithDefaultValue: 'world',
        optionalIsArrayCarOrTruckWithDefaultValue: [
            new StaticSchemaEntityImpl(carSchema, { name: 'fast car' }),
        ],
        optionalCarOrTruckWithDefaultValue: new StaticSchemaEntityImpl(
            carSchema,
            {
                name: 'fast car',
            }
        ),
    })
    protected static defaultValueTests(
        definition: Schema,
        expectedDefaultValues: Record<string, any>
    ) {
        const schema = new StaticSchemaEntityImpl(definition)
        const defaultValues = schema.getDefaultValues()
        assert.isEqualDeep(defaultValues, expectedDefaultValues)
    }

    @test('Can get default typed correctly (test will pass, lint will fail)')
    protected static defaultValueTypeTests() {
        const schema = new StaticSchemaEntityImpl(personSchema)
        const defaultValues = schema.getDefaultValues()
        const defaultValuesWithoutSchemas = schema.getDefaultValues({
            shouldCreateEntityInstances: false,
        })

        assert.isFunction(
            defaultValues.optionalIsArrayCarOrTruckWithDefaultValue[0].get
        )
        assert.isEqual(
            defaultValuesWithoutSchemas
                .optionalIsArrayCarOrTruckWithDefaultValue[0].id,
            'car'
        )
        assert.isEqual(
            defaultValuesWithoutSchemas
                .optionalIsArrayCarOrTruckWithDefaultValue[0].values.name,
            'fast car'
        )

        const carEntity = new StaticSchemaEntityImpl(carSchema, {
            name: 'fast car',
        }) as StaticSchemaEntity<CarSchema>

        assert.isType<PersonMappedDefaultValues>(defaultValues)
        assert.isEqualDeep(
            defaultValues.optionalIsArrayCarOrTruckWithDefaultValue,
            [carEntity]
        )

        assert.isType<PersonExpectedDefaultValuesWithoutSchema>(
            defaultValuesWithoutSchemas
        )

        assert.isType<PersonExpectedDefaultValues>(defaultValues)
    }

    @test()
    protected static canGetDefaultValuesFromSchemaWithRequiredFields() {
        const avatar = buildSchema({
            id: 'sprucebotAvatar',
            name: 'Sprucebot avatar',
            description: '',
            fields: {
                size: {
                    type: 'select',
                    label: 'Size',
                    isRequired: true,
                    defaultValue: 'medium',
                    options: {
                        choices: [
                            {
                                value: 'small',
                                label: 'Small',
                            },
                            {
                                value: 'medium',
                                label: 'Medium',
                            },
                            {
                                value: 'large',
                                label: 'Large',
                            },
                        ],
                    },
                },
                stateOfMind: {
                    type: 'select',
                    label: 'State of mind',
                    isRequired: true,
                    defaultValue: 'chill',
                    options: {
                        choices: [
                            {
                                value: 'chill',
                                label: 'Chill - Sprucebot is saying something informative or a salutation',
                            },
                            {
                                value: 'contemplative',
                                label: 'Contemplative - Sprucebot is loading or sending data',
                            },
                            {
                                value: 'accomplished',
                                label: 'Accomplished - Sprucebot is celebrating because a process has finished',
                            },
                        ],
                    },
                },
            },
        })

        const defaults = defaultSchemaValues(avatar)

        assert.isEqualDeep(defaults, { size: 'medium', stateOfMind: 'chill' })
    }

    @test.only()
    protected static canGetDefaultValuesForUnionFields() {
        const schema = new StaticSchemaEntityImpl(personSchema)
        const {
            optionalIsArrayCarOrTruckWithDefaultValue,
            optionalCarOrTruckWithDefaultValue,
        } = schema.getDefaultValues()

        assert.isFunction(optionalCarOrTruckWithDefaultValue.get)
        assert.isEqual(optionalIsArrayCarOrTruckWithDefaultValue.length, 1, '')

        assert.isEqual(
            optionalCarOrTruckWithDefaultValue.schemaId === 'car' &&
                optionalCarOrTruckWithDefaultValue.get('name'),
            'fast car'
        )

        assert.isEqual(
            optionalIsArrayCarOrTruckWithDefaultValue[0] &&
                optionalIsArrayCarOrTruckWithDefaultValue[0].schemaId ===
                    'car' &&
                optionalIsArrayCarOrTruckWithDefaultValue[0].get('name'),
            'fast car'
        )
    }
}
