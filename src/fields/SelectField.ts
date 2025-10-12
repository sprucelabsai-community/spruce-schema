import { FieldError } from '../errors/options.types'
import {
    FieldTemplateDetailOptions,
    FieldTemplateDetails,
} from '../types/template.types'
import { selectChoicesToHash } from '../utilities/selectChoicesToHash'
import AbstractField from './AbstractField'
import { SelectFieldDefinition, SelectChoice } from './SelectField.types'

export default class SelectField<
    T extends SelectFieldDefinition = SelectFieldDefinition,
> extends AbstractField<T> {
    public static readonly description =
        'Stored as string, lets user select between available options.'

    public constructor(name: string, definition: T) {
        super(name, definition)
        if (!definition.options || !definition.options.choices) {
            throw new Error('Select field is missing choices.')
        }
    }

    public static generateTypeDetails() {
        return {
            valueTypeMapper:
                'SelectFieldValueTypeMapper<F extends SelectFieldDefinition ? F: SelectFieldDefinition>',
        }
    }

    public validate(value: any): FieldError[] {
        const validChoices = selectChoicesToHash(
            this.definition.options.choices
        )

        const errors = super.validate(value)

        if (value && !validChoices[value]) {
            errors.push({
                code: 'INVALID_PARAMETER',
                name: this.name,
                friendlyMessage: `'${value}' is not valid! Valid choices are: '${Object.keys(
                    validChoices
                ).join("','")}'`,
            })
        }

        return errors
    }

    public static generateTemplateDetails(
        options: FieldTemplateDetailOptions<SelectFieldDefinition>
    ): FieldTemplateDetails {
        const { definition, language } = options
        const {
            isArray,
            options: { choices },
        } = definition

        const arrayNotation = isArray ? '[]' : ''

        if (language === 'go') {
            return {
                valueType: `${arrayNotation}string`,
            }
        }

        return {
            valueType: `(${choices
                .map(
                    (choice) =>
                        `${typeof choice.value === 'number' ? choice.value : `"${choice.value}"`}`
                )
                .join(' | ')})${arrayNotation}`,
        }
    }

    public getChoices(): SelectChoice[] {
        return this.definition.options.choices
    }
}
