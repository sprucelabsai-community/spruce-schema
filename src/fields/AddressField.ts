import { FieldType } from './index'
import AbstractField, { IFieldDefinition } from './AbstractField'

export interface IAddressFieldValue {
	street1: string
	street2?: string
	city: string
	province: string
	country: string
	zip: string
}

export interface IAddressFieldDefinition extends IFieldDefinition {
	/** * .Address - An address field */
	type: FieldType.Address
	value?: IAddressFieldValue
	defaultValue?: IAddressFieldValue
	options?: {}
}

export default class AddressField extends AbstractField<
	IAddressFieldDefinition
> {
	public static templateDetails() {
		return {
			valueType: 'IAddressFieldValue'
		}
	}
}
