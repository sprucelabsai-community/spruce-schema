import {
    FieldTemplateDetailOptions,
    FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { RawFieldDefinition } from './RawField.types'

export default class RawField extends AbstractField<RawFieldDefinition> {
    public static readonly description = 'Set an interface directly.'
    public static generateTemplateDetails(
        options: FieldTemplateDetailOptions<RawFieldDefinition>
    ): FieldTemplateDetails {
        const { definition, language } = options
        const { isArray } = definition
        const { options: fieldOptions } = definition
        const { valueType } = fieldOptions
        const arrayNotation = isArray ? '[]' : ''

        let resolvedType = valueType

        if (language === 'go') {
            const goType =
                valueType === 'Record<string, any>'
                    ? 'map[string]interface{}'
                    : 'interface{}'

            resolvedType = `${arrayNotation}${goType}`
        } else {
            resolvedType = `${valueType}${arrayNotation}`
        }

        return {
            valueType: resolvedType,
        }
    }
}
