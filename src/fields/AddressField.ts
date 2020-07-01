import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { IFieldDefinition } from '../schema.types'
import { IFieldTemplateDetailOptions } from '../template.types'
import AbstractField from './AbstractField'

export interface IAddressFieldValue {
	street1: string
	street2?: string
	city: string
	province: string
	country: string
	zip: string
}

export type IAddressFieldDefinition = IFieldDefinition<IAddressFieldValue> & {
	/** * An address with street, city, province, country, and zip details */
	type: FieldType.Address
	options?: {}
}

export default class AddressField extends AbstractField<
	IAddressFieldDefinition
> {
	public static get description() {
		return 'An address with geocoding ability *coming soon*'
	}
	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<IAddressFieldDefinition>
	) {
		return {
			valueType: `${options.importAs}.IAddressFieldValue${
				options.definition.isArray ? '[]' : ''
			}`
		}
	}
}
