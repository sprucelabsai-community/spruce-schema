import { test, assert } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import SpruceError from '../../errors/SpruceError'
import { SchemaValues } from '../../schemas.static.types'
import validationErrorAssert from '../../tests/validationErrorAssert.utility'
import areSchemaValuesValid from '../../utilities/areSchemaValuesValid'
import buildSchema from '../../utilities/buildSchema'
import isSchemaValid from '../../utilities/isSchemaValid'
import validateSchemaValues from '../../utilities/validateSchemaValues'
const profileImagesSchema = buildSchema({
    id: 'profileImage',
    name: 'Profile Image Sizes',
    description: 'Various sizes that a profile image comes in.',
    fields: {
        profile60: {
            label: '60x60',
            type: 'text',
            isRequired: true,
        },
        profile150: {
            label: '150x150',
            type: 'text',
            isRequired: true,
        },
        'profile60@2x': {
            label: '60x60',
            type: 'text',
            isRequired: true,
        },
        'profile150@2x': {
            label: '150x150',
            type: 'text',
            isRequired: true,
        },
    },
})

const dynamicSchema = buildSchema({
    id: 'dynamicSchema',
    name: 'dynamic schema',
    dynamicFieldSignature: {
        type: 'text',
        keyName: 'anything',
    },
})

const personSchema = buildSchema({
    id: 'testPerson',
    name: 'A test person',
    fields: {
        firstName: {
            label: 'First name',
            type: 'text',
            isRequired: true,
        },
        lastName: {
            type: 'text',
            isRequired: true,
        },
        email: {
            type: 'text',
            isRequired: false,
        },
        profileImages: {
            isRequired: true,
            type: 'schema',
            options: {
                schema: profileImagesSchema,
            },
        },
    },
})

const personWithFavColorsSchema = buildSchema({
    id: 'personWithFavColors',
    fields: {
        firstName: {
            type: 'text',
            isRequired: true,
        },
        lastName: {
            type: 'text',
            isRequired: true,
        },
        favoriteColors: {
            type: 'text',
            isArray: true,
            isRequired: true,
        },
    },
})

const toolSchema = buildSchema({
    id: 'tool',
    fields: {
        name: {
            type: 'text',
            isRequired: true,
        },
    },
})

const fruitSchema = buildSchema({
    id: 'fruit',
    fields: {
        color: {
            type: 'select',
            isRequired: true,
            options: {
                choices: [
                    {
                        value: 'yellow',
                        label: 'Yellow',
                    },
                    {
                        value: 'green',
                        label: 'Green',
                    },
                ],
            },
        },
    },
})

const versionedToolSchema = buildSchema({
    id: 'versionedTool',
    version: '1.0',
    fields: {
        name: {
            type: 'text',
            isRequired: true,
        },
        age: {
            type: 'number',
            isRequired: true,
        },
    },
})

const version2ToolSchema = buildSchema({
    id: 'versionedTool',
    version: '2.0',
    fields: {
        size: {
            type: 'text',
            isRequired: true,
        },
    },
})

const versionedFruitSchema = buildSchema({
    id: 'versionedFruit',
    version: '1.0',
    fields: {
        color: {
            type: 'select',
            isRequired: true,
            options: {
                choices: [
                    {
                        value: 'yellow',
                        label: 'Yellow',
                    },
                    {
                        value: 'green',
                        label: 'Green',
                    },
                ],
            },
        },
    },
})

const personWithFavToolsSchema = buildSchema({
    id: 'personWithFavTools',
    name: 'Person with favorite tools',
    fields: {
        firstName: {
            type: 'text',
            isRequired: true,
        },
        lastName: {
            type: 'text',
        },
        favoriteTools: {
            isRequired: true,
            type: 'schema',
            isArray: true,
            options: {
                schema: toolSchema,
            },
        },
    },
})

const personWithFavToolsOrFruitSchema = buildSchema({
    id: 'personWithFavToolsOrFruit',
    name: 'Person with favorite tools',
    fields: {
        firstName: {
            type: 'text',
            isRequired: true,
        },
        phone: {
            type: 'phone',
        },
        lastName: {
            type: 'text',
        },
        favoriteToolsOrFruit: {
            isRequired: true,
            type: 'schema',
            isArray: true,
            options: {
                schemas: [toolSchema, fruitSchema],
            },
        },
    },
})

const versionedPersonWithFavToolsOrFruitSchema = buildSchema({
    id: 'versionedPersonWithFavToolsOrFruit',
    name: 'Person with favorite tools',
    fields: {
        firstName: {
            type: 'text',
            label: 'First name',
            isRequired: true,
        },
        lastName: {
            type: 'text',
        },
        favoriteToolsOrFruit: {
            isRequired: true,
            type: 'schema',
            isArray: true,
            options: {
                schemas: [
                    versionedFruitSchema,
                    versionedToolSchema,
                    version2ToolSchema,
                ],
            },
        },
    },
})

const dynamicFieldSchema = buildSchema({
    id: 'dynamicSchemaValuesTest',
    dynamicFieldSignature: {
        type: 'schema',
        keyName: 'eventName',
        options: {
            schema: personSchema,
        },
    },
})

export default class CanValidateSchemasTest extends AbstractSchemaTest {
    protected static async beforeEach() {
        await super.beforeEach()
    }

    @test()
    protected static async canValidateBasicSchemaValues() {
        const err = assert.doesThrow(() =>
            validateSchemaValues(personSchema, {})
        )

        assert.doesInclude(err.message, '3 errors')
        assert.doesInclude(err.message, `1. 'firstName' is required`)
        assert.doesInclude(err.message, `2. 'lastName' is required`)
        assert.doesInclude(err.message, `3. 'profileImages' is required`)
    }

    @test()
    protected static async canValidateSchemaWithArrayValues() {
        assert.doesThrow(
            () =>
                validateSchemaValues(personWithFavColorsSchema, {
                    firstName: 'tay',
                    lastName: 'ro',
                }),
            /'favoriteColors' is required/gi
        )
    }

    @test()
    protected static async typesValidatedValues() {
        const values = {
            firstName: 'Bob',
            lastName: 'Bob',
            profileImages: {
                profile60: '@',
                profile150: '@',
                'profile60@2x': '@',
                'profile150@2x': '@',
            },
        }
        validateSchemaValues(personSchema, values)
        assert.isType<SchemaValues<typeof personSchema>>(values)
        assert.isType<string | undefined | null>(values.email)
    }

    @test()
    protected static async canValidateSpecificFields() {
        const err = assert.doesThrow(() =>
            validateSchemaValues(personSchema, {}, { fields: ['firstName'] })
        )

        assert.doesNotInclude(err.message, /lastName/gi)
    }

    @test()
    protected static async canCheckValidityWithoutThrowing() {
        const isValid = areSchemaValuesValid(personSchema, {})
        assert.isFalse(isValid)
    }

    @test()
    protected static async canCheckValidityOnDynamicFieldsWithoutThrowing() {
        const isValid = isSchemaValid(dynamicSchema)
        assert.isTrue(isValid)
    }

    @test()
    protected static async canCheckValidityOnSpecificFields() {
        const isValid = areSchemaValuesValid(
            personSchema,
            { firstName: 'test' },
            { fields: ['firstName'] }
        )
        assert.isTrue(isValid)
    }

    @test()
    protected static async failsOnSpecificFields() {
        const isValid = areSchemaValuesValid(
            personSchema,
            { firstName: 'test' },
            { fields: ['lastName'] }
        )
        assert.isFalse(isValid)
    }

    @test()
    protected static async passesWithValidPerson() {
        const person = {
            firstName: 'firstName',
            lastName: 'lastName',
            profileImages: {
                profile60: '@',
                profile150: '@',
                'profile60@2x': '@',
                'profile150@2x': '@',
            },
        }

        validateSchemaValues(personSchema, person)
    }

    @test()
    protected static async failsWithBadSchema() {
        assert.doesThrow(
            //@ts-ignore
            () => validateSchemaValues(null, {}),
            /Invalid schema/
        )
    }

    @test()
    protected static async failsWhenValidatingFieldsNotOnSchema() {
        const err = assert.doesThrow(
            () =>
                validateSchemaValues(personSchema, {
                    taco: 'bravo',
                    firstName: 'first',
                    lastName: 'last',
                    profileImages: {
                        profile60: '@',
                        profile150: '@',
                        'profile60@2x': '@',
                        'profile150@2x': '@',
                    },
                }),
            /does not exist/
        )

        validationErrorAssert.assertError(err, {
            unexpected: ['taco'],
        })

        assert.doesInclude(err.message, 'taco')
    }

    @test()
    protected static async givesInvalidFieldErrorWhenValidatingEmptyArrayNestedSchemas() {
        const err = assert.doesThrow(
            () =>
                validateSchemaValues(personWithFavToolsSchema, {
                    firstName: 'first',
                    lastName: 'last',
                    favoriteTools: [],
                }),
            /'favoriteTools' must have at least 1/
        )

        validationErrorAssert.assertError(err, {
            invalid: ['favoriteTools'],
        })
    }

    @test()
    protected static async givesInvalidFieldErrorWhenValidatingNestedSchemas() {
        const err = assert.doesThrow(
            () =>
                validateSchemaValues(personWithFavToolsSchema, {
                    firstName: 'first',
                    lastName: 'last',
                    //@ts-ignore
                    favoriteTools: [{}],
                }),
            /'favoriteTools.name' is required/
        )

        validationErrorAssert.assertError(err, {
            missing: ['favoriteTools.name'],
        })
    }

    @test()
    protected static async canValidateNestedArraySchema() {
        validateSchemaValues(personWithFavToolsSchema, {
            firstName: 'Tay',
            favoriteTools: [
                {
                    name: 'Laptop',
                },
            ],
        })
    }

    @test()
    protected static async canValidateArrayOfUnionValuesMissingRequired() {
        assert.doesThrow(
            () =>
                validateSchemaValues(personWithFavToolsOrFruitSchema, {
                    firstName: 'Ryan',
                    favoriteToolsOrFruit: [],
                }),
            /'favoriteToolsOrFruit' must have at least 1/gi
        )
    }

    @test()
    protected static async canValidateArrayOfUnionValues() {
        validateSchemaValues(personWithFavToolsOrFruitSchema, {
            firstName: 'Ryan',
            favoriteToolsOrFruit: [
                {
                    schemaId: 'fruit',
                    values: {
                        color: 'green',
                    },
                },
                {
                    schemaId: 'fruit',
                    values: {
                        color: 'yellow',
                    },
                },
                {
                    schemaId: 'tool',
                    values: {
                        name: 'wrench',
                    },
                },
            ],
        })
    }

    @test()
    protected static async canValidateArrayOfVersionedUnionValues() {
        validateSchemaValues(versionedPersonWithFavToolsOrFruitSchema, {
            firstName: 'Ryan',
            favoriteToolsOrFruit: [
                {
                    schemaId: 'versionedFruit',
                    version: '1.0',
                    values: {
                        color: 'green',
                    },
                },
                {
                    schemaId: 'versionedFruit',
                    version: '1.0',
                    values: {
                        color: 'yellow',
                    },
                },
                {
                    schemaId: 'versionedTool',
                    version: '1.0',
                    values: {
                        name: 'wrench',
                        age: 10,
                    },
                },
                {
                    schemaId: 'versionedTool',
                    version: '2.0',
                    values: {
                        size: 'wrench',
                    },
                },
            ],
        })
    }

    @test()
    protected static async canValidateArrayOfVersionedUnionValuesAndThrowsReallyHelpfulError() {
        /*Const err =*/
        assert.doesThrow(() =>
            validateSchemaValues(versionedPersonWithFavToolsOrFruitSchema, {
                favoriteToolsOrFruit: [
                    {
                        schemaId: 'versionedFruit',
                        version: '1.0',
                        values: {
                            color: 'green',
                        },
                    },
                    {
                        schemaId: 'versionedFruit',
                        version: '1.0',
                        values: {
                            color: 'yellow',
                        },
                    },
                    {
                        schemaId: 'versionedTool',
                        version: '1.0',
                        values: {
                            size: 'wrench',
                        },
                    },
                    {
                        schemaId: 'versionedTool',
                        version: '2.0',
                        values: {
                            name: 'wrench',
                        },
                    },
                ],
            })
        )

        // NOTE uncomment here and above to see error output
        // const message = err.friendlyMessage()
        // console.log(message)
        // debugger
    }

    @test()
    protected static throwsWhenAddingExtraFieldAtTopLevel() {
        assert.doesThrow(
            () =>
                validateSchemaValues(personWithFavToolsOrFruitSchema, {
                    firstName: 'Ryan',
                    doesNotExist: true,
                    favoriteToolsOrFruit: [
                        {
                            schemaId: 'fruit',
                            values: {
                                color: 'green',
                            },
                        },
                    ],
                }),
            /doesNotExist/
        )
    }

    @test()
    protected static throwsWhenAddingExtraFieldInNestedSchema() {
        assert.doesThrow(
            () =>
                validateSchemaValues(personWithFavToolsOrFruitSchema, {
                    firstName: 'Ryan',
                    favoriteToolsOrFruit: [
                        {
                            schemaId: 'fruit',
                            values: {
                                doesNotExist: true,
                                color: 'green',
                            },
                        },
                    ],
                }),
            /doesNotExist/
        )
    }

    @test('validation errors are typed (will always pass, lint will fail)')
    protected static validationErrorsAreTyped() {
        try {
            validateSchemaValues(personWithFavToolsOrFruitSchema, {
                firstName: 'Ryan',
                favoriteToolsOrFruit: [],
            })
        } catch (err) {
            if (err instanceof SpruceError) {
                if (err.options.code === 'VALIDATION_FAILED') {
                    const first = err.options.errors[0].code
                    assert.isExactType<
                        typeof first,
                        | 'MISSING_PARAMETER'
                        | 'INVALID_PARAMETER'
                        | 'UNEXPECTED_PARAMETER'
                    >(true)
                }
            } else {
                assert.fail('Bad error returned')
            }
        }
    }

    @test.skip('pretty print of validation test (skip to pass tests)')
    protected static printsSoPretty() {
        try {
            validateSchemaValues(personWithFavToolsOrFruitSchema, {
                //@ts-ignore
                taco: [],
                phone: 'satnoehusntah',
                favoriteToolsOrFruit: [
                    { schemaId: 'tool', values: { cheba: 'hut' } },
                ],
            })
        } catch (err: any) {
            this.log(err.message)
        }
    }

    @test()
    protected static dynamicSchemasHaveFieldNameInError() {
        const err = assert.doesThrow(() =>
            validateSchemaValues(dynamicFieldSchema, {
                //@ts-ignore
                taco: {
                    //@ts-ignore
                    hey: 'there',
                },
            })
        )

        assert.doesInclude(err.message, 'taco')
        assert.doesInclude(err.message, 'hey')
    }

    @test()
    protected static invalidFieldsGiveDescriptionsOnWhySomethingIsInvalid() {
        const err = assert.doesThrow(() =>
            validateSchemaValues(personWithFavToolsOrFruitSchema, {
                phone: 'cheesy',
            })
        )

        assert.doesInclude(err.message, 'a valid phone number')
    }

    @test()
    protected static validateValuesWithDotSyntax() {
        const nestedSchema = buildSchema({
            id: 'nested-tested',
            fields: {
                nested1: {
                    type: 'schema',
                    options: {
                        schema: buildSchema({
                            id: 'nested-tested-nested',
                            fields: {
                                field1: {
                                    type: 'text',
                                },
                                field2: {
                                    type: 'text',
                                },
                            },
                        }),
                    },
                },
            },
        })

        validateSchemaValues(nestedSchema, {
            //@ts-ignore
            'nested1.field1': 'go!',
        })

        validateSchemaValues(nestedSchema, {
            //@ts-ignore
            'nested1.field2': 'go!',
        })

        assert.doesThrow(() =>
            validateSchemaValues(nestedSchema, {
                //@ts-ignore
                'nested1.field3': 'oh no!',
            })
        )
    }
}
