import { FieldType } from '#spruce:schema/fields/fieldType'
import AbstractField, { IFieldDefinition } from './AbstractField'

export interface IDateTimeFieldValue {
	gmt: string
}

export type IDateTimeFieldDefinition = IFieldDefinition<IDateTimeFieldValue> & {
	/** * A date/time field that stores everything in GMT and handles all the timezone */
	type: FieldType.DateTime
	options?: { dateTimeFormat?: string }
}

export default class DateTimeField extends AbstractField<
	IDateTimeFieldDefinition
> {
	public static templateDetails() {
		return {
			valueType: 'IDateTimeFieldValue',
			description: 'Date and time support.'
		}
	}
}
