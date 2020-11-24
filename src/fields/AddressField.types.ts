import { IFieldDefinition } from './field.static.types'

export interface AddressFieldValue {
	street1: string
	street2?: string
	city: string
	province: string
	country: string
	zip: string
}

export type IAddressFieldDefinition = IFieldDefinition<AddressFieldValue> & {
	/** * An address with street, city, province, country, and zip details */
	type: 'address'
	// eslint-disable-next-line @typescript-eslint/ban-types
	options?: {}
}
