import { test, assert, suite } from '@sprucelabs/test-utils'
import { errorAssert } from '@sprucelabs/test-utils'
import { Schema, SchemaValues } from 'schemas.static.types'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import validationErrorAssert from '../../tests/validationErrorAssert.utility'
import buildSchema from '../../utilities/buildSchema'
import validateSchemaValues from '../../utilities/validateSchemaValues'

const noMinOrMaxSchema = buildSchema({
    id: 'noMinOrMax',
    fields: {
        favoriteColors: {
            type: 'text',
            isArray: true,
            isRequired: true,
        },
    },
})

const zeroMinValuesSchema = buildSchema({
    id: 'zeroMinValues',
    fields: {
        favoriteColors: {
            type: 'text',
            isArray: true,
            isRequired: true,
            minArrayLength: 0,
        },
    },
})

const twoMinValuesSchema = buildSchema({
    id: 'twoMinValues',
    fields: {
        favoriteColors: {
            type: 'text',
            isArray: true,
            isRequired: true,
            minArrayLength: 2,
        },
    },
})

const oneMaxValueSchema = buildSchema({
    id: 'oneMaxValue',
    fields: {
        favoriteCars: {
            type: 'text',
            isArray: true,
            isRequired: true,
            maxArrayLength: 1,
        },
    },
})

const twoMaxValueSchema = buildSchema({
    id: 'twoMaxValue',
    fields: {
        favoriteColors: {
            type: 'text',
            isArray: true,
            isRequired: true,
            maxArrayLength: 2,
        },
    },
})

const zeroMinTwoRequiredFields = buildSchema({
    id: 'zeroMinTwoRequiredFields',
    fields: {
        name: {
            type: 'text',
            isRequired: true,
        },
        favoriteColors: {
            type: 'text',
            isArray: true,
            isRequired: true,
            minArrayLength: 0,
        },
    },
})

@suite()
export default class SettingMinAndMaxValuesOnArrayFieldsTest extends AbstractSchemaTest {
    @test()
    protected defaultsToOneValueRequired() {
        this.assertThrowsValidationFailed(noMinOrMaxSchema, {
            favoriteColors: [],
        })
    }

    @test()
    protected failsWhenMissing() {
        const err = assert.doesThrow(() =>
            validateSchemaValues(zeroMinTwoRequiredFields, {})
        )

        validationErrorAssert.assertError(err, {
            missing: ['name', 'favoriteColors'],
        })
    }

    @test()
    protected defaultOneValueRequiredPassesWithOneValue() {
        validateSchemaValues(noMinOrMaxSchema, { favoriteColors: ['pink'] })
    }

    @test()
    protected minArrayLengthZero() {
        validateSchemaValues(zeroMinValuesSchema, { favoriteColors: [] })
    }

    @test()
    protected minArrayLength2ThrowsWithLessThan() {
        this.assertThrowsValidationFailed(twoMinValuesSchema, {
            favoriteColors: ['purple'],
        })
    }

    @test()
    protected passesWithMoreThanMin() {
        validateSchemaValues(twoMinValuesSchema, {
            favoriteColors: ['pink', 'purple'],
        })
    }

    @test()
    protected async maxArrayLengthOf1ThrowsWithTwo() {
        this.assertThrowsValidationFailed(oneMaxValueSchema, {
            favoriteCars: ['honda', 'toyota'],
        })
    }

    @test()
    protected async doesNotThrowWithMaxArrayLengthOf1() {
        validateSchemaValues(oneMaxValueSchema, {
            favoriteCars: ['honda'],
        })
    }

    @test()
    protected async maxArrayLengthOf1ThrowsWith3Values() {
        this.assertThrowsValidationFailed(oneMaxValueSchema, {
            favoriteCars: ['honda', 'toyota', 'ford'],
        })
    }

    @test()
    protected async maxArrayLengthOf2DoesNotThrowWith2Values() {
        validateSchemaValues(twoMaxValueSchema, {
            favoriteColors: ['pink', 'purple'],
        })
    }

    private assertThrowsValidationFailed<S extends Schema>(
        schema: S,
        values: SchemaValues<S>
    ) {
        const err = assert.doesThrow(() => validateSchemaValues(schema, values))
        errorAssert.assertError(err, 'VALIDATION_FAILED')
    }
}
