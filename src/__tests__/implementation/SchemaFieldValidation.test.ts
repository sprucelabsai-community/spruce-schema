import { test, assert } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import FieldFactory from '../../factories/FieldFactory'
import buildPersonWithCar, { PersonSchema } from '../data/personWithCars'

export default class SchemaFieldTest extends AbstractSchemaTest {
    private static personSchema: PersonSchema

    protected static async beforeEach() {
        await super.beforeEach()
        const { personSchema } = buildPersonWithCar()
        this.personSchema = personSchema
    }

    @test('fails on non-object', true, ['INVALID_PARAMETER'])
    @test(
        'passes because everything has name and a string is good',
        { name: 'cheese!' },
        []
    )
    @test("knows it's missing the name and name is required", { taco: true }, [
        'INVALID_PARAMETER',
    ])
    protected static async testNonUnionValidation(
        value: any,
        expectedErrorCodes: string[]
    ) {
        const requiredField = FieldFactory.Field(
            'requiredCar',
            this.personSchema.fields.requiredCar
        )
        const optionalField = FieldFactory.Field(
            'optionalCar',
            this.personSchema.fields.optionalCar
        )
        const requiredIsArrayField = FieldFactory.Field(
            'requiredIsArrayCar',
            this.personSchema.fields.requiredIsArrayCars
        )
        const optionalIsArrayField = FieldFactory.Field(
            'optionalRequiredCar',
            this.personSchema.fields.optionalIsArrayCars
        )

        let codes = requiredField.validate(value).map((err) => err.code)
        assert.isEqualDeep(codes, expectedErrorCodes)

        codes = optionalField.validate(value).map((err) => err.code)
        assert.isEqualDeep(codes, expectedErrorCodes)

        codes = requiredIsArrayField.validate(value).map((err) => err.code)
        assert.isEqualDeep(codes, expectedErrorCodes)

        codes = optionalIsArrayField.validate(value).map((err) => err.code)
        assert.isEqualDeep(codes, expectedErrorCodes)
    }

    @test()
    protected static async testSingleUnionFailsValidation() {
        const optionalCarOrTruckField = FieldFactory.Field(
            'optionalCarOrTruck',
            this.personSchema.fields.optionalCarOrTruck
        )

        const value = {
            id: 'car',
            values: {},
        }

        const errors = optionalCarOrTruckField.validate(value)

        assert.isEqual(errors[0].code, 'INVALID_PARAMETER')
        assert.isEqual(errors[0].errors?.[0]?.code, 'MISSING_PARAMETER')
        assert.isEqual(errors[0].errors?.[0]?.name, 'name')
    }

    @test()
    protected static async testSingleUnionValidation() {
        const optionalCarOrTruckField = FieldFactory.Field(
            'optionalCarOrTruck',
            this.personSchema.fields.optionalCarOrTruck
        )

        const value = {
            id: 'car',
            values: {
                name: 'great car',
            },
        }

        const codes = optionalCarOrTruckField.validate(value)

        assert.isLength(codes, 0)
    }
}
