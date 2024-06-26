import { FieldDefinition } from './field.static.types'

export interface AddressFieldValue {
    street1: string
    street2?: string
    city: string
    province: string
    country: string
    zip: string
}

export type AddressFieldDefinition = FieldDefinition<AddressFieldValue> & {
    /** * An address with street, city, province, country, and zip details */
    type: 'address'

    options?: {}
}
