import {
    FieldTemplateDetailOptions,
    FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { BooleanFieldDefinition } from './BooleanField.types'

export default class BooleanField extends AbstractField<BooleanFieldDefinition> {
    public static readonly description =
        'A true/false. Converts false string to false, all other strings to true.'

    public static generateTemplateDetails(
        options: FieldTemplateDetailOptions<BooleanFieldDefinition>
    ): FieldTemplateDetails {
        const { definition, language } = options
        const { isArray } = definition
        const arrayNotation = isArray ? '[]' : ''

        let valueType = ''

        if (language === 'go') {
            valueType = `${arrayNotation}bool`
        } else {
            valueType = `boolean${arrayNotation}`
        }

        return {
            valueType,
        }
    }
    /** * Turn everything into a string */
    public toValueType(value: any): boolean {
        switch (value) {
            case 'true':
                return true
            case 'false':
                return false
        }
        return !!value
    }
}
