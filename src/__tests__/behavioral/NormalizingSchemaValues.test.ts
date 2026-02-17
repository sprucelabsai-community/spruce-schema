import { test, assert } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import {
    Schema,
    SchemaFieldNames,
    SchemaGetValuesOptions,
    SchemaPartialValues,
    SchemaValues,
} from '../../schemas.static.types'
import StaticSchemaEntityImpl from '../../StaticSchemaEntityImpl'
import buildSchema from '../../utilities/buildSchema'
import defaultSchemaValues from '../../utilities/defaultSchemaValues'
import normalizePartialSchemaValues from '../../utilities/normalizePartialSchemaValues'
import normalizeSchemaValues from '../../utilities/normalizeSchemaValues'

export default class NormalizingSchemaValues extends AbstractSchemaTest {
    @test()
    protected static normalizesSimpleAsExpected() {
        const values = normalizeSchemaValues(
            this.personSchema,
            {
                // @ts-ignore
                firstName: 12345,
                // @ts-ignore
                age: '10',
                nestedArraySchema: [{ field1: 'first' }, { field1: 'second' }],
            },
            { shouldCreateEntityInstances: false }
        )

        assert.isEqualDeep(values, {
            firstName: '12345',
            age: 10,
            boolean: undefined,
            privateBooleanField: undefined,
            references: undefined,
            nestedArraySchema: [
                { field1: 'first', field2: undefined },
                { field1: 'second', field2: undefined },
            ],
        })
    }

    @test()
    protected static normalizeTypesAsExpected() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const values = normalizeSchemaValues(
            this.personSchema,
            {
                firstName: 'tay',
                age: 0,
                nestedArraySchema: [{ field1: 'first' }, { field1: 'second' }],
            },
            { shouldCreateEntityInstances: false }
        )

        assert.isExactType<
            typeof values,
            {
                firstName: string
                age: number | null | undefined
                boolean: boolean | null | undefined
                privateBooleanField: boolean | null | undefined
                references: string[] | null | undefined
                nestedArraySchema:
                    | { field1?: string | null | undefined }[]
                    | null
                    | undefined
            }
        >(true)
    }

    @test()
    protected static normalizeTypesAsExpectedNotIncludingNullAndUndefined() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const values = normalizeSchemaValues(
            this.personSchema,
            {
                firstName: 'tay',
                age: 0,
                nestedArraySchema: [{ field1: 'first' }, { field1: 'second' }],
            },
            {
                shouldCreateEntityInstances: false,
                shouldIncludeNullAndUndefinedFields: false,
            }
        )

        assert.isExactType<
            typeof values,
            {
                firstName: string
                age?: number | null | undefined
                boolean?: boolean | null | undefined
                privateBooleanField?: boolean | null | undefined
                nestedArraySchema?:
                    | { field1?: string | null | undefined }[]
                    | null
                    | undefined
            }
        >(true)
    }

    @test(
        'normalizes boolean with string false to false',
        { boolean: 'false' },
        'boolean',
        false
    )
    @test(
        'normalizes boolean with string true to true',
        { boolean: 'true' },
        'boolean',
        true
    )
    @test(
        'normalizes private boolean with string false to false',
        { privateBooleanField: 'false' },
        'privateBooleanField',
        false
    )
    @test(
        'normalizes private boolean with string true to true',
        { privateBooleanField: 'true' },
        'privateBooleanField',
        true
    )
    protected static normalizeAndCheckField(
        overrideValues: Record<string, any>,
        fieldName: string,
        expected: any
    ) {
        const values = normalizeSchemaValues(this.personSchema, {
            firstName: 'tay',
            age: 0,
            nestedArraySchema: [{ field1: 'first' }, { field1: 'second' }],
            ...overrideValues,
        })

        //@ts-ignore
        assert.isEqual(values[fieldName], expected)
    }

    @test()
    protected static honorsNotMakingSchemaEntitiesWithEntityValues() {
        const secondLevelSchema = buildSchema({
            id: 'nested-2nd-level-schema-entity',
            fields: {
                boolField: {
                    type: 'boolean',
                },
            },
        })

        const schema = buildSchema({
            id: 'schema-entities',
            fields: {
                related: {
                    type: 'schema',
                    isArray: true,
                    isRequired: true,
                    options: {
                        schema: {
                            id: 'nested-schema-entities',
                            fields: {
                                textField: {
                                    type: 'text',
                                },
                                nested: {
                                    type: 'schema',
                                    options: {
                                        schema: secondLevelSchema,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        })

        const values = normalizeSchemaValues(
            schema,
            {
                related: [
                    {
                        textField: 'hello!',
                        nested: new StaticSchemaEntityImpl(secondLevelSchema, {
                            boolField: true,
                        }) as any,
                    },
                ],
            },
            { shouldCreateEntityInstances: false }
        )

        assert.isFalse(values.related[0] instanceof StaticSchemaEntityImpl)
        assert.isFalse(
            values.related[0].nested instanceof StaticSchemaEntityImpl
        )

        assert.isEqualDeep(values, {
            related: [
                {
                    textField: 'hello!',
                    nested: { boolField: true },
                },
            ],
        })
    }

    @test()
    protected static async canNormalizePartialValuesPassesBack() {
        this.assertPartialNormalizesToWhatIsPassed({
            firstName: 'tay',
        })

        this.assertPartialNormalizesToWhatIsPassed({
            firstName: 'tay',
            age: 10,
        })
    }

    @test()
    protected static async normalizePartialNormalizesValues() {
        this.assertPartialNormalizesTo(
            {
                age: '10' as any,
                boolean: false,
            },
            {
                age: 10,
                boolean: false,
            }
        )
    }

    @test()
    protected static async betterNormalizePartialTyping() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const actual = normalizePartialSchemaValues(this.personSchema, {
            age: 10,
        })

        assert.isExactType<
            typeof actual,
            {
                age: number | null
            }
        >(true)
    }

    @test()
    protected static async canNormalizeWithuotDotNotation() {
        const schema = buildSchema({
            id: 'partialValuesDotNotation',
            fields: {
                target: {
                    type: 'schema',
                    options: {
                        schema: buildSchema({
                            id: 'partialValuesDotNotationTarget',
                            fields: {
                                one: {
                                    type: 'text',
                                },
                                two: {
                                    type: 'text',
                                },
                            },
                        }),
                    },
                },
            },
        })

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const actual = normalizePartialSchemaValues(
            schema,
            {
                'target.one': 'hello',
            },
            { shouldRetainDotNotationKeys: true }
        )

        assert.isExactType<
            typeof actual,
            {
                //@TODO - get types in sub schemas working
                'target.one': unknown
            }
        >(true)
    }

    @test()
    protected static async partialNormalizesNestedSchemaValues() {
        const values: Partial<TestPerson> = {
            nestedArraySchema: [
                {
                    field1: 'first',
                },
            ],
        }

        this.assertPartialNormalizesTo(values, values)
    }

    @test()
    protected static async canNormalizeValuesStrippingUndefinedAndNull() {
        const values = normalizeSchemaValues(
            this.personSchema,
            {
                boolean: true,
                firstName: 'test',
                nestedArraySchema: null,
            },
            {
                shouldIncludeNullAndUndefinedFields: false,
            }
        )

        assert.isEqualDeep(values as any, {
            boolean: true,
            firstName: 'test',
        })
    }

    @test()
    protected static async canStripUndefinedAndNullValuesFromNested() {
        const values = normalizeSchemaValues(
            this.personSchema,
            {
                firstName: 'test',
                nestedArraySchema: [
                    {
                        field1: 'first',
                        field2: null,
                    },
                    {
                        field1: undefined,
                        field2: 'second',
                    },
                ],
            },
            {
                shouldIncludeNullAndUndefinedFields: false,
            }
        )

        assert.isEqualDeep(values as any, {
            firstName: 'test',
            nestedArraySchema: [
                {
                    field1: 'first',
                },
                {
                    field2: 'second',
                },
            ],
        })
    }

    @test()
    protected static async nestedFieldsDontGetSkippedByIncludeFields() {
        const person = this.normalize(
            {
                firstName: 'test',
                nestedArraySchema: [
                    {
                        field1: 'first',
                        field2: null,
                    },
                    {
                        field1: undefined,
                        field2: 'second',
                    },
                ],
            },
            {
                fields: ['nestedArraySchema'],
            }
        )

        assert.isEqualDeep(person as any, {
            nestedArraySchema: [
                {
                    field1: 'first',
                    field2: null,
                },
                {
                    field1: undefined,
                    field2: 'second',
                },
            ],
        })
    }

    @test()
    protected static async normalizingWithoutValidationDoesNotThrowWhenMissingNested() {
        this.normalize(
            {
                nestedArraySchema: [{}],
            },
            {
                shouldValidate: false,
            },
            testPerson2Schema
        )
    }

    @test()
    protected static async typingTests() {
        const validateAndNormalizer = {
            validateAndNormalize<S extends Schema = Schema>(
                schema: S,
                options: SchemaPartialValues<S, false>
            ) {
                const values = {
                    ...defaultSchemaValues(schema),
                    ...options,
                } as SchemaValues<S>

                normalizeSchemaValues(schema, values)
            },
        }

        validateAndNormalizer.validateAndNormalize(testPersonSchema, {
            firstName: 'tay',
        })
    }

    @test('can exclude firstName', ['firstName'], {
        age: 10,
        privateBooleanField: true,
    })
    @test('can exclude age', ['age'], {
        privateBooleanField: true,
        firstName: 'test',
    })
    @test('can exclude both firstName and age', ['firstName', 'age'], {
        privateBooleanField: true,
    })
    protected static async canExcludeFieldsWhenNormalizing(
        excludeFields: SchemaFieldNames<TestPersonSchema>[],
        expected: Partial<TestPerson>
    ) {
        const values = normalizeSchemaValues(
            this.personSchema,
            {
                firstName: 'test',
                age: 10,
                privateBooleanField: true,
            },
            {
                excludeFields,
                shouldIncludeNullAndUndefinedFields: false,
            }
        )

        assert.isEqualDeep(values, expected)
    }

    @test()
    protected static async leavesNullInArrayValuesIfShouldValidateFalse() {
        const values = this.normalize(
            {
                //@ts-ignore
                references: [null],
            },
            {
                shouldValidate: false,
            }
        )

        assert.isEqualDeep(values, {
            references: [null],
            age: undefined,
            boolean: undefined,
            firstName: undefined,
            nestedArraySchema: undefined,
            privateBooleanField: undefined,
        })
    }

    @test()
    protected static async doesNotThrowWhenNullIsSecondValueAndShouldValidateFalse() {
        this.normalize(
            {
                //@ts-ignore
                references: ['test', null],
            },
            {
                shouldValidate: false,
            }
        )
    }

    private static normalize(
        values: Partial<TestPerson>,
        options?: SchemaGetValuesOptions<TestPersonSchema>,
        schema?: Schema
    ) {
        return normalizeSchemaValues(
            schema ?? this.personSchema,
            values,
            options as any
        )
    }

    private static assertPartialNormalizesTo(
        values: Record<string, any>,
        expected: Partial<TestPerson>
    ) {
        const normalized = this.normalizePartial(values)
        assert.isEqualDeep(normalized, expected)
    }

    private static assertPartialNormalizesToWhatIsPassed(
        expected: Partial<TestPerson>
    ) {
        const values = this.normalizePartial(expected)
        assert.isEqualDeep(values, expected)
    }

    private static normalizePartial(expected: Partial<TestPerson>) {
        return normalizePartialSchemaValues(this.personSchema, expected)
    }

    private static get personSchema() {
        return testPersonSchema
    }
}

const testPersonSchema = buildSchema({
    id: 'testPerson',
    name: 'A test person',
    fields: {
        firstName: {
            type: 'text',
            isRequired: true,
        },
        age: {
            type: 'number',
        },
        boolean: {
            type: 'boolean',
        },
        privateBooleanField: {
            type: 'boolean',
            isPrivate: true,
        },
        references: {
            type: 'text',
            isArray: true,
            minArrayLength: 0,
            label: 'References',
            hint: 'Links or references related to the tip',
        },
        nestedArraySchema: {
            type: 'schema',
            isArray: true,
            options: {
                schema: {
                    id: 'nested-schema',
                    name: 'Nested',
                    fields: {
                        field1: {
                            type: 'text',
                        },
                        field2: {
                            type: 'text',
                        },
                    },
                },
            },
        },
    },
})

type TestPersonSchema = typeof testPersonSchema
type TestPerson = SchemaValues<TestPersonSchema>

const testPerson2Schema = buildSchema({
    id: 'test2Person',
    name: 'A test person',
    fields: {
        firstName: {
            type: 'text',
            isRequired: true,
        },
        age: {
            type: 'number',
        },
        boolean: {
            type: 'boolean',
        },
        privateBooleanField: {
            type: 'boolean',
            isPrivate: true,
        },
        nestedArraySchema: {
            type: 'schema',
            isArray: true,
            options: {
                schema: {
                    id: 'nested-schema',
                    name: 'Nested',
                    fields: {
                        field1: {
                            type: 'text',
                        },
                        field2: {
                            type: 'text',
                        },
                        id: {
                            type: 'id',
                            isRequired: true,
                        },
                    },
                },
            },
        },
    },
})
