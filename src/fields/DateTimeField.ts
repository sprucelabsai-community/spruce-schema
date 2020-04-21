import { FieldType } from '#spruce:schema/fields/fieldType'
import AbstractField, { IFieldDefinition } from './AbstractField'
import { IFieldTemplateDetailOptions } from '../template.types'

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
	public static get description() {
		return 'Date and time support.'
	}
	public static templateDetails(
		options: IFieldTemplateDetailOptions<IDateTimeFieldDefinition>
	) {
		return {
			valueType: `${options.importAs}.IDateTimeFieldValue${
				options.definition.isArray ? '[]' : ''
			}`
		}
	}
}
