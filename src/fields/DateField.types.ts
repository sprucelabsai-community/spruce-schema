import { FieldDefinition } from './field.static.types'

export type DateFieldValue = number

export type DateFieldDefinition = FieldDefinition<DateFieldValue> & {
	/** * A date/time field that stores everything in GMT and handles all the timezone */
	type: 'date'
}
