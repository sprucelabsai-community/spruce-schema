import { FieldDefinition } from './field.static.types'

export interface IDateFieldValue extends Date {}

export type IDateFieldDefinition = FieldDefinition<IDateFieldValue> & {
	/** * A date/time field that stores everything in GMT and handles all the timezone */
	type: 'date'
	options?: { DateFormat?: string }
}
