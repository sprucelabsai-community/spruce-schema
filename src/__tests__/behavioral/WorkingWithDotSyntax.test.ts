import { test, assert, generateId } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import buildSchema from '../../utilities/buildSchema'
import normalizeSchemaValues from '../../utilities/normalizeSchemaValues'

export default class WorkingWithDotSyntaxTest extends AbstractSchemaTest {
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
            shouldRetainDotSyntaxKeys: true,
        })
    }

    @test()
    protected static async canNormalizeAndRetainDifferentKeys() {
        const values = {
            firstName: generateId(),
            'source.locationId': generateId(),
        }

        this.assertNormalizedValuesEqual(values, values, {
            shouldRetainDotSyntaxKeys: true,
        })
    }

    private static assertNormalizedValuesEqual(
        values: Record<string, any>,
        expected: Record<string, any>,
        options?: {
            shouldRetainDotSyntaxKeys?: boolean
        }
    ) {
        const normalized = normalizeSchemaValues(personSchema, values, {
            shouldRetainDotSyntaxKeys: options?.shouldRetainDotSyntaxKeys,
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
