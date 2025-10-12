import {
    FieldTemplateDetailOptions,
    FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { IdFieldDefinition } from './IdField.types'

export default class IdField extends AbstractField<IdFieldDefinition> {
    public static readonly description = 'A unique identifier field.'

    public static generateTemplateDetails(
        options: FieldTemplateDetailOptions<IdFieldDefinition>
    ): FieldTemplateDetails {
        const { language, definition } = options
        const { isArray } = definition

        const arrayNotation = isArray ? '[]' : ''

        return {
            valueType:
                language === 'go'
                    ? `${arrayNotation}string`
                    : `string${arrayNotation}`,
        }
    }

    public toValueType(value: any) {
        return `${value}`
    }
}
