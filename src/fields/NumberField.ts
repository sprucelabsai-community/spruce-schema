import { FieldError } from '../errors/options.types'
import SpruceError from '../errors/SpruceError'
import {
    FieldTemplateDetailOptions,
    FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { NumberFieldDefinition } from './NumberField.types'

export default class NumberField extends AbstractField<NumberFieldDefinition> {
    public static readonly description =
        'Handles all types of numbers with min/max and clamp support'

    public static generateTemplateDetails(
        options: FieldTemplateDetailOptions<NumberFieldDefinition>
    ): FieldTemplateDetails {
        const { definition, language } = options
        const { isArray, options: fieldOptions } = definition
        const go = `${isArray ? '[]' : ''}float64`

        let validation: undefined | string[] = undefined

        if (language === 'go') {
            validation = []
            if (fieldOptions?.min) {
                validation.push(`gte=${fieldOptions.min}`)
            }
            if (fieldOptions?.max) {
                validation.push(`lte=${fieldOptions.max}`)
            }
        }

        return {
            valueType: language === 'go' ? go : `number${isArray ? '[]' : ''}`,
            validation,
        }
    }

    public toValueType(value: any): number {
        const numberValue = +value
        if (!this.isNumber(numberValue)) {
            throw new SpruceError({
                code: 'TRANSFORMATION_ERROR',
                fieldType: 'number',
                incomingTypeof: typeof value,
                incomingValue: value,
                errors: [
                    this.buildNaNError(
                        `${JSON.stringify(value)} could not be converted to a number.`
                    ),
                ],
                name: this.name,
            })
        }

        return numberValue
    }

    private buildNaNError(msg: string): FieldError {
        return {
            friendlyMessage: msg,
            code: 'INVALID_PARAMETER',
            name: this.name,
        }
    }

    public validate(value: any, options: any) {
        const errors = super.validate(value, options)

        if (errors.length === 0) {
            if (!this.isNumber(value)) {
                errors.push(
                    this.buildNaNError(
                        `"${JSON.stringify(value)}" is not a number!`
                    )
                )
            }
        }

        return errors
    }

    private isNumber(value: any) {
        return typeof value === 'undefined' || value === null || !isNaN(value)
    }
}
