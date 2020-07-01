import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { IFieldDefinition } from '../schema.types'

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
