import { test, assert, generateId } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import { SchemaGetValuesOptions } from '../../schemas.static.types'
import buildSchema from '../../utilities/buildSchema'
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
    protected static async normalizeCanRetainDotSyntaxKeys() {
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
    protected static async canFilterFieldsValuesUsingDotSyntax() {
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
    id: 'personWithDotSyntax',
    fields: {
        firstName: {
            type: 'text',
            isRequired: true,
        },
        source: {
            type: 'schema',
            options: {
                schema: buildSchema({
                    id: 'personWithDotSyntaxSource',
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
