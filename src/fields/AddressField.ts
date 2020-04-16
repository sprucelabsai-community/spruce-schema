import { FieldType } from '#spruce:schema/fields/fieldType'
import AbstractField, { IFieldDefinition } from './AbstractField'

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
	public static templateDetails() {
		return {
			valueType: 'IAddressFieldValue',
			description: 'An address with geocoding ability *coming soon*'
		}
	}
}
