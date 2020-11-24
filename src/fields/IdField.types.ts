import { FieldDefinition } from './field.static.types'

export type IIdFieldDefinition = FieldDefinition<string> & {
	/** * .Id a field to hold a unique id (UUID4 in Spruce) */
	type: 'id'
	// eslint-disable-next-line @typescript-eslint/ban-types
	options?: {}
}
