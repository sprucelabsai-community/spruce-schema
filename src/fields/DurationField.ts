import { FieldError } from '../errors/options.types'
import SpruceError from '../errors/SpruceError'
import {
    FieldTemplateDetailOptions,
    FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import {
    DurationFieldDefinition,
    DurationFieldValue,
} from './DurationField.types'
import { ValidateOptions } from './field.static.types'
import { TextFieldDefinition } from './TextField.types'

export function reduceDurationToMs(duration: Partial<DurationFieldValue>) {
    const d = buildDuration(duration)

    let ms = 0

    ms += d.ms
    ms += d.seconds * 1000
    ms += d.minutes * 60 * 1000
    ms += d.hours * 60 * 60 * 1000

    return ms
}

export function buildDuration(
    value: string | number | Partial<DurationFieldValue>
): DurationFieldValue {
    let totalMs = 0

    if (typeof value === 'string') {
        totalMs = parseInt(value, 10)
    } else if (typeof value === 'number') {
        totalMs = value
    } else if (typeof value === 'object') {
        totalMs += typeof value.ms === 'number' ? value.ms : 0
        totalMs += typeof value.seconds === 'number' ? value.seconds * 1000 : 0
        totalMs +=
            typeof value.minutes === 'number' ? value.minutes * 1000 * 60 : 0
        totalMs +=
            typeof value.hours === 'number' ? value.hours * 1000 * 60 * 60 : 0
    }

    if (typeof totalMs !== 'number') {
        throw new SpruceError({
            code: 'INVALID_PARAMETERS',
            parameters: ['na'],
            friendlyMessage: `\`${value}\` is not a valid duration!`,
        })
    }

    const ms = totalMs % 1000
    totalMs = (totalMs - ms) / 1000
    const seconds = totalMs % 60
    totalMs = (totalMs - seconds) / 60
    const minutes = totalMs % 60
    const hours = (totalMs - minutes) / 60

    return { hours, minutes, seconds, ms }
}

export default class DurationField extends AbstractField<DurationFieldDefinition> {
    public static get description() {
        return 'A span of time represented in { hours, minutes, seconds, ms }'
    }

    public static generateTemplateDetails(
        options: FieldTemplateDetailOptions<DurationFieldDefinition>
    ): FieldTemplateDetails {
        return {
            valueType: `${options.importAs}.DurationFieldValue${
                options.definition.isArray ? '[]' : ''
            }`,
        }
    }

    public validate(
        value: any,
        _?: ValidateOptions<TextFieldDefinition>
    ): FieldError[] {
        const errors: FieldError[] = []
        try {
            buildDuration(value)
        } catch (err: any) {
            errors.push({
                code: 'INVALID_PARAMETER',
                name: this.name,
                originalError: err,
                friendlyMessage: err.options?.friendlyMessage,
            })
        }

        return errors
    }

    public toValueType(value: any): DurationFieldValue {
        return buildDuration(value)
    }
}
