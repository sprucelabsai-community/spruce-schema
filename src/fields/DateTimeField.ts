import { FieldType } from '.'
import BaseField, { IBaseFieldDefinition } from './BaseField'

export interface IDateTimeFieldValue {
	gmt: string
}

export interface IDateTimeFieldDefinition extends IBaseFieldDefinition {
	/** * .DateTime - Date and time */
	type: FieldType.DateTime
	value?: IDateTimeFieldValue
	defaultValue?: IDateTimeFieldValue
	options?: {
		/** How should this dateTime render using moment.js format */
		dateTimeFormat?: string
	}
}

export default class DateTimeField extends BaseField<IDateTimeFieldDefinition> {
	public static templateDetails() {
		return {
			definitionInterface: 'IDateTimeFieldDefinition',
			valueType: 'IDateTimeFieldValue'
		}
	}
}
