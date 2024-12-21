import { test, assert, generateId } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import { SchemaGetValuesOptions } from '../../schemas.static.types'
import buildSchema from '../../utilities/buildSchema'
import flattenValues from '../../utilities/flattenValues'
import normalizeSchemaValues from '../../utilities/normalizeSchemaValues'

export default class WorkingWithDotNotationTest extends AbstractSchemaTest {
    @test()
    protected static async canExpandSourceOrganizationId() {
        const organizationId = generateId()

        const values = {
            firstName: 'bob',
            'source.organizationId': organizationId,
        }
        const expected = {
            firstName: 'bob',
            source: {
                organizationId,
                locationId: undefined,
            },
        }

        this.assertNormalizedValuesEqual(values, expected)
    }

    @test()
    protected static async canExpandSourceLocationId() {
        const locationId = generateId()

        const values = {
            firstName: 'bob',
            'source.locationId': locationId,
        }
        const expected = {
            firstName: 'bob',
            source: {
                organizationId: undefined,
                locationId,
            },
        }

        this.assertNormalizedValuesEqual(values, expected)
    }

    @test()
    protected static async normalizeCanRetainDotNotationKeys() {
        const values = {
            firstName: generateId(),
            'source.organizationId': generateId(),
            'source.locationId': generateId(),
        }

        this.assertNormalizedValuesEqual(values, values, {
            shouldRetainDotNotationKeys: true,
        })
    }

    @test()
    protected static async canNormalizeAndRetainDifferentKeys() {
        const values = {
            firstName: generateId(),
            'source.locationId': generateId(),
        }

        this.assertNormalizedValuesEqual(values, values, {
            shouldRetainDotNotationKeys: true,
        })
    }

    @test()
    protected static async canFilterFieldsValuesUsingDotNotation() {
        const organizationId = generateId()

        this.assertNormalizedValuesEqual(
            {
                firstName: generateId(),
                source: {
                    organizationId,
                    locationId: generateId(),
                },
            },
            {
                source: {
                    organizationId,
                },
            },
            {
                fields: ['source.organizationId' as any],
            }
        )
    }

    @test()
    protected static async canFlattenToDotNotation() {
        this.assertFlattenedValuesEquals(
            {
                name: 'first',
            },
            {
                name: 'first',
            }
        )

        this.assertFlattenedValuesEquals(
            {
                another: 'value',
            },
            {
                another: 'value',
            }
        )
    }

    @test()
    protected static async canFlattenSingleLevel() {
        this.assertFlattenedValuesEquals(
            {
                source: {
                    organizationId: 'org',
                },
            },
            {
                'source.organizationId': 'org',
            }
        )
    }

    @test()
    protected static async canFlattenMultipleLevels() {
        this.assertFlattenedValuesEquals(
            {
                firstName: 'my name',
                source: {
                    organization: {
                        id: 'org',
                    },
                },
            },
            {
                firstName: 'my name',
                'source.organization.id': 'org',
            }
        )
    }

    @test()
    protected static async canFlattenNullAndUndefinedValues() {
        this.assertFlattenedValuesEquals(
            {
                firstName: 'my name',
                lastName: null,
                age: undefined,
            },
            {
                firstName: 'my name',
                lastName: null,
                age: undefined,
            }
        )
    }

    @test()
    protected static async canIgnoreFieldsForFlattening() {
        this.assertFlattenedValuesEquals(
            {
                firstName: 'my name',
                source: {
                    organizationId: 'org',
                },
            },
            {
                firstName: 'my name',
                source: {
                    organizationId: 'org',
                },
            },
            ['source']
        )
    }

    @test()
    protected static async canIgnoreMultipleFieldsForFlattening() {
        this.assertFlattenedValuesEquals(
            {
                firstName: 'my name',
                payload: {
                    locationId: 'loc',
                },
                target: {
                    organizationId: 'org',
                },
            },
            {
                firstName: 'my name',
                payload: {
                    locationId: 'loc',
                },
                target: {
                    organizationId: 'org',
                },
            },
            ['payload', 'target']
        )
    }

    @test()
    protected static async canIgnoreBasedOnWildcard() {
        this.assertFlattenedValuesEquals(
            {
                firstName: 'my name',
                target: {
                    organizationId: 'org',
                },
            },
            {
                firstName: 'my name',
                target: {
                    organizationId: 'org',
                },
            },
            ['*.organizationId']
        )
    }

    @test()
    protected static async wildCardHonorsFieldName() {
        this.assertFlattenedValuesEquals(
            {
                firstName: 'my name',
                target: {
                    organizationId: 'org',
                },
            },
            {
                firstName: 'my name',
                'target.organizationId': 'org',
            },
            ['*.locationId']
        )
    }

    @test()
    protected static async canWildcardIgnoreMultipleFields() {
        this.assertFlattenedValuesEquals(
            {
                lastName: 'my name',
                target: {
                    personId: 'person',
                },
                source: {
                    testId: 'test',
                },
            },
            {
                lastName: 'my name',
                target: {
                    personId: 'person',
                },
                source: {
                    testId: 'test',
                },
            },
            ['*.personId', '*.testId']
        )
    }

    @test()
    protected static async goodTypingWithDotNotation() {
        normalizeSchemaValues(personSchema, {
            'source.locationId': 'aoeu',
            firstName: generateId(),
        })
    }

    private static assertFlattenedValuesEquals(
        values: Record<string, any>,
        expected: Record<string, any>,
        ignoreKeys?: string[]
    ) {
        const actual = flattenValues(values, ignoreKeys)
        assert.isEqualDeep(actual, expected)
    }

    private static assertNormalizedValuesEqual(
        values: Record<string, any>,
        expected: Record<string, any>,
        options?: SchemaGetValuesOptions<PersonSchema>
    ) {
        const normalized = normalizeSchemaValues(personSchema, values, {
            ...options,
        })
        assert.isEqualDeep(normalized, expected)
    }
}

const personSchema = buildSchema({
    id: 'personWithDotNotation',
    fields: {
        firstName: {
            type: 'text',
            isRequired: true,
        },
        source: {
            type: 'schema',
            options: {
                schema: buildSchema({
                    id: 'personWithDotNotationSource',
                    fields: {
                        organizationId: {
                            type: 'id',
                        },
                        locationId: {
                            type: 'id',
                        },
                    },
                }),
            },
        },
    },
})

type PersonSchema = typeof personSchema
