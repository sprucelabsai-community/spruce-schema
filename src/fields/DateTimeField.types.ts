import { FieldDefinition } from './field.static.types'

export interface IDateTimeFieldValue {
	gmt: string
}

export type IDateTimeFieldDefinition = FieldDefinition<IDateTimeFieldValue> & {
	/** * A date/time field that stores everything in GMT and handles all the timezone */
	type: 'dateTime'
	options?: { dateTimeFormat?: string }
}
