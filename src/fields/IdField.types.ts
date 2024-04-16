import { FieldDefinition } from './field.static.types'

export type IdFieldDefinition = FieldDefinition<string> & {
    /** * .Id a field to hold a unique id (UUID4 in Spruce) */
    type: 'id'

    options?: {}
}
