import { FieldType } from '.'
import FieldBase, { IFieldBaseDefinition } from './Base'

export interface IFieldDateTimeValue {
	gmt: string
}

export interface IFieldDateTimeDefinition extends IFieldBaseDefinition {
	/** * .DateTime - Date and time */
	type: FieldType.DateTime
	value?: IFieldDateTimeValue
	defaultValue?: IFieldDateTimeValue
	options?: {
		/** How should this dateTime render using moment.js format */
		dateTimeFormat?: string
	}
}

export default class FieldDateTime extends FieldBase<IFieldDateTimeDefinition> {
	public static templateDetails() {
		return {
			definitionInterface: 'IFieldDateTimeDefinition',
			valueType: 'IFieldDateTimeValue'
		}
	}
}
