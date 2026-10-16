import { FieldError } from '../errors/options.types'
import SpruceError from '../errors/SpruceError'
import {
    FieldTemplateDetails,
    FieldTemplateDetailOptions,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { TextFieldDefinition } from './TextField.types'

export default class TextField extends AbstractField<TextFieldDefinition> {
    public static readonly description =
        'A text field. Converts non-strings into strings by calling toString(). Size set by options.'

    public static generateTemplateDetails(
        options: FieldTemplateDetailOptions<TextFieldDefinition>
    ): FieldTemplateDetails {
        const { definition, language } = options

        const valueType =
            language === 'go'
                ? `${definition.isArray ? '[]' : ''}string`
                : `string${definition.isArray ? '[]' : ''}`
        return {
            valueType,
        }
    }

    public validate(value: any): FieldError[] {
        const errors = super.validate(value, this.options)
        const { maxLength, minLength } = this.options ?? {}
        const isString = typeof this.convertToString(value) === 'string'

        if (isString) {
            const length = [...value.toString()].length

            if (maxLength && length > maxLength) {
                errors.push({
                    code: 'INVALID_PARAMETER',
                    name: this.name,
                    label: this.label,
                    friendlyMessage: `${this.name} should not exceed ${maxLength} characters!`,
                })
            }

            if (minLength && value.length < minLength) {
                errors.push({
                    code: 'INVALID_PARAMETER',
                    name: this.name,
                    label: this.label,
                    friendlyMessage: `${this.name} should be at least ${minLength} characters!`,
                })
            }
        }

        if (errors.length === 0) {
            if (value && !isString) {
                errors.push({
                    code: 'INVALID_PARAMETER',
                    name: this.name,
                    label: this.label,
                    friendlyMessage: `${this.name} should be a string!`,
                })
            }
            if (this.isRequired && `${value}`.trim().length === 0) {
                errors.push({
                    code: 'MISSING_PARAMETER',
                    label: this.label,
                    name: this.name,
                })
            }
        }

        return errors
    }

    public toValueType(value: any): string {
        let transformed = this.convertToString(value)

        if (typeof transformed === 'string') {
            return transformed
        }

        throw new SpruceError({
            code: 'TRANSFORMATION_ERROR',
            fieldType: 'text',
            incomingTypeof: typeof value,
            incomingValue: value,
            errors: [
                {
                    friendlyMessage: `${JSON.stringify(
                        value
                    )} could not be converted to a string.`,
                    code: 'INVALID_PARAMETER',
                    name: this.name,
                },
            ],
            name: this.name,
        })
    }

    private convertToString(value: any) {
        return typeof value === 'string'
            ? value
            : typeof value === 'number' &&
                  value &&
                  value.toString &&
                  value.toString()
    }
}
