import {
	FieldTemplateDetailOptions,
	FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { AddressFieldDefinition } from './AddressField.types'

export default class AddressField extends AbstractField<AddressFieldDefinition> {
	public static get description() {
		return 'An address with geocoding ability *coming soon*'
	}
	public static generateTemplateDetails(
		options: FieldTemplateDetailOptions<AddressFieldDefinition>
	): FieldTemplateDetails {
		return {
			valueType: `${options.importAs}.IAddressFieldValue${
				options.definition.isArray ? '[]' : ''
			}`,
		}
	}
}
