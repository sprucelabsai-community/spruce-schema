import { FieldDefinition } from './field.static.types'

export interface DateTimeFieldValue {
	gmt: string
}

export type DateTimeFieldDefinition = FieldDefinition<DateTimeFieldValue> & {
	/** * A date/time field that stores everything in GMT and handles all the timezone */
	type: 'dateTime'
	options?: { dateTimeFormat?: string }
}
