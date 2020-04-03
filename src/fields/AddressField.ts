import { FieldType } from './index'
import BaseField, { IBaseFieldDefinition } from './BaseField'

export interface IAddressFieldValue {
	street1: string
	street2?: string
	city: string
	province: string
	country: string
	zip: string
}

export interface IAddressFieldDefinition extends IBaseFieldDefinition {
	/** * .Address - An address field */
	type: FieldType.Address
	value?: IAddressFieldValue
	defaultValue?: IAddressFieldValue
	options?: {}
}

export default class AddressField extends BaseField<IAddressFieldDefinition> {
	public static templateDetails() {
		return {
			definitionInterface: 'IAddressFieldDefinition',
			valueType: 'IAddressFieldValue'
		}
	}
}
