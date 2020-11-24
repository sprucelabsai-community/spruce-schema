import {
	FieldTemplateDetailOptions,
	IFieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { IAddressFieldDefinition } from './AddressField.types'

export default class AddressField extends AbstractField<
	IAddressFieldDefinition
> {
	public static get description() {
		return 'An address with geocoding ability *coming soon*'
	}
	public static generateTemplateDetails(
		options: FieldTemplateDetailOptions<IAddressFieldDefinition>
	): IFieldTemplateDetails {
		return {
			valueType: `${options.importAs}.IAddressFieldValue${
				options.definition.isArray ? '[]' : ''
			}`,
		}
	}
}
