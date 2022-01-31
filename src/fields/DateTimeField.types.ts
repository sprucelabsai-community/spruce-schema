import { FieldDefinition } from './field.static.types'

export type DateTimeFieldValue = number

export type DateTimeFieldDefinition = FieldDefinition<DateTimeFieldValue> & {
	/** * A date/time field that stores everything in GMT and handles all the timezone */
	type: 'dateTime'
	options?: { dateTimeFormat?: string }
}
