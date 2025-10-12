import { FieldError } from '../errors/options.types'
import {
    FieldTemplateDetailOptions,
    FieldTemplateDetails,
} from '../types/template.types'
import getStartOfDay from '../utilities/getStartOfDay'
import isUndefinedOrNull from '../utilities/isUndefinedOrNull'
import AbstractField from './AbstractField'
import { DateFieldDefinition } from './DateField.types'
import { ValidateOptions } from './field.static.types'

export default class DateField extends AbstractField<DateFieldDefinition> {
    public static readonly description = 'Date and time support.'
    public static generateTemplateDetails(
        options: FieldTemplateDetailOptions<DateFieldDefinition>
    ): FieldTemplateDetails {
        const { definition, importAs, language } = options
        const { isArray } = definition
        const arrayNotation = isArray ? '[]' : ''
        return {
            valueType:
                language === 'go'
                    ? `${arrayNotation}${importAs}.DateFieldValue`
                    : `${importAs}.DateFieldValue${arrayNotation}`,
        }
    }

    public validate(
        value: any,
        options?: ValidateOptions<DateFieldDefinition>
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
        return value ? getStartOfDay(+value) : value
    }
}

export function validateDateValue(options: {
    value: any
    isRequired: boolean
    name: string
}): FieldError[] {
    const { value, isRequired, name } = options

    if (isUndefinedOrNull(value) && !isRequired) {
        return []
    }

    if (typeof value === 'number' || value instanceof Date) {
        return []
    } else if (typeof value === 'string') {
        const date = new Date(value)
        if (date.toString() !== 'Invalid Date') {
            return []
        }
    }
    return [
        {
            name,
            code: 'INVALID_PARAMETER',
            friendlyMessage: `This doesn't look like a date to me!`,
        },
    ]
}
