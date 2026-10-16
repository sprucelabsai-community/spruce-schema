import { test, assert, generateId } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import FieldFactory from '../../factories/FieldFactory'
import { Field, ValidateOptions } from '../../fields/field.static.types'
import { TextFieldDefinition } from '../../fields/TextField.types'

export default class TextFieldTest extends AbstractSchemaTest {
    protected static fieldName = generateId()
    protected static fieldLabel = generateId()
    protected static field: Field<TextFieldDefinition>

    protected static async beforeEach() {
        await super.beforeEach()
        this.field = TextFieldTest.Field()
    }

    @test()
    protected static async zeroLengthStringFailsValidationWhenRequired() {
        const errors = this.validateAndAssertError('')
        assert.isEqual(errors[0].code, 'MISSING_PARAMETER')
    }

    @test('max length throws invalid error length: 101, max: 100', 101, 100)
    @test('max length throws invalid error length: 11, max: 10', 11, 10)
    protected static async maxLengthThrowsInvalidError(
        stringLength: number,
        maxLength: number
    ) {
        const errors = this.validateAndAssertError('a'.repeat(stringLength), {
            maxLength,
        })
        assert.isEqual(errors[0].code, 'INVALID_PARAMETER')
        assert.isEqual(
            errors[0].name,
            this.fieldName,
            'Field name does not match'
        )
        assert.isEqual(
            errors[0].label,
            this.fieldLabel,
            'Field label does not match'
        )
    }

    @test()
    protected static async maxLengthPassesValidation() {
        const errors = this.validate('a'.repeat(100), {
            maxLength: 100,
        })

        assert.isEqual(errors.length, 0, 'Expected no validation errors')
    }

    @test('min length throws invalid error length: 1, min: 2', 1, 2)
    @test('min length throws invalid error length: 2, min: 3', 2, 3)
    protected static async minLengthFailsValidation(
        stringLength: number,
        minLength: number
    ) {
        const errors = this.validateAndAssertError('a'.repeat(stringLength), {
            minLength,
        })
        assert.isEqual(errors[0].code, 'INVALID_PARAMETER')
        assert.isEqual(
            errors[0].name,
            this.fieldName,
            'Field name does not match'
        )

        assert.isEqual(
            errors[0].label,
            this.fieldLabel,
            'Field label does not match'
        )
    }

    @test()
    protected static async minLengthDoseNotThrowAndHonorsEmojis() {
        const errors = this.validate('👍', {
            minLength: 1,
        })
        assert.isLength(errors, 0, 'Expected no validation errors')
    }

    @test()
    protected static async minLengthHonorsEmojis() {
        this.validateAndAssertError('👍', {
            minLength: 2,
        })
    }

    @test()
    protected static async maxLengthHonorsEmojis() {
        const errors = this.validate('👍', {
            maxLength: 1,
        })

        assert.isLength(errors, 0, 'Expected at least one validation error')
    }

    @test()
    protected static async minLengthPassesValidation() {
        const errors = this.validate('aa', {
            minLength: 2,
        })
        assert.isEqual(errors.length, 0, 'Expected no validation errors')
    }

    @test()
    protected static async passingNonStringDoesNotTriggerMaxLength() {
        const errors = this.validateAndAssertError(
            //@ts-ignore
            { hey: 'there' },
            {
                maxLength: 1,
            }
        )
        assert.doesInclude(
            errors[0].friendlyMessage,
            'string',
            'Expected transformation error message'
        )
    }

    @test()
    protected static async stringWithJustSpacesThowsMissing() {
        const errors = this.validateAndAssertError('   ', {})
        assert.isEqual(errors[0].code, 'MISSING_PARAMETER')
    }

    private static validateAndAssertError(
        value: string,
        options?: ValidateOptions<TextFieldDefinition>
    ) {
        const errors = this.validate(value, options)
        assert.isLength(errors, 1, 'Expected at least one validation error')
        return errors
    }

    private static validate(
        value: string,
        options?: ValidateOptions<TextFieldDefinition>
    ) {
        if (options) {
            this.field = this.Field(options)
        }
        return this.field.validate(value)
    }

    private static Field(
        options?: ValidateOptions<TextFieldDefinition>
    ): Field<TextFieldDefinition> {
        return FieldFactory.Field(this.fieldName, {
            type: 'text',
            isRequired: true,
            label: this.fieldLabel,
            options,
        })
    }
}
