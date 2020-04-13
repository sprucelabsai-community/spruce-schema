import { FieldType } from '#spruce:schema/fields/fieldType'
import AbstractField, { IFieldDefinition } from './AbstractField'

export interface IDateTimeFieldValue {
	gmt: string
}

export interface IDateTimeFieldDefinition extends IFieldDefinition {
	/** * .DateTime - Date and time */
	type: FieldType.DateTime
	value?: IDateTimeFieldValue
	defaultValue?: IDateTimeFieldValue
	options?: {
		/** How should this dateTime render using moment.js format */
		dateTimeFormat?: string
	}
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
