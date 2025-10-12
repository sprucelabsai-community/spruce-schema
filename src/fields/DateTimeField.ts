import { FieldError } from '../errors/options.types'
import {
    FieldTemplateDetailOptions,
    FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { validateDateValue } from './DateField'
import { DateTimeFieldDefinition } from './DateTimeField.types'
import { ValidateOptions } from './field.static.types'

export default class DateTimeField extends AbstractField<DateTimeFieldDefinition> {
    public static readonly description = 'Date and time support.'

    public static generateTemplateDetails(
        options: FieldTemplateDetailOptions<DateTimeFieldDefinition>
    ): FieldTemplateDetails {
        const { definition, importAs, language } = options
        const { isArray } = definition
        const arrayNotation = isArray ? '[]' : ''
        return {
            valueType:
                language === 'go'
                    ? `${arrayNotation}${importAs}.DateTimeFieldValue`
                    : `${importAs}.DateTimeFieldValue${arrayNotation}`,
        }
    }

    public validate(
        value: any,
        options?: ValidateOptions<DateTimeFieldDefinition>
    ): FieldError[] {
        const errors = super.validate(value, options)
        if (errors.length > 0) {
            return errors
        }

        return validateDateValue({
            value,
            isRequired: this.isRequired,
            name: this.name,
        })
    }

    public toValueType(value: any) {
        let normalized = value

        if (normalized instanceof Date) {
            normalized = normalized.getTime()
        }

        if (this.options?.dateTimeFormat === 'iso_8601') {
            return new Date(value).toISOString()
        }

        if (typeof normalized === 'string') {
            normalized = new Date(normalized).getTime()
        }

        return normalized ? +normalized : normalized
    }
}
