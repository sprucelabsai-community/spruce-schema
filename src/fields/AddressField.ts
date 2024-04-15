import {
    FieldTemplateDetailOptions,
    FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { AddressFieldDefinition } from './AddressField.types'

export default class AddressField extends AbstractField<AddressFieldDefinition> {
    public static readonly description =
        'An address with geocoding ability *coming soon*'
    public static generateTemplateDetails(
        options: FieldTemplateDetailOptions<AddressFieldDefinition>
    ): FieldTemplateDetails {
        return {
            valueType: `${options.importAs}.AddressFieldValue${
                options.definition.isArray ? '[]' : ''
            }`,
        }
    }
}
