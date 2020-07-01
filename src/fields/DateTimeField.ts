import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { IFieldDefinition } from '../schema.types'
import { IFieldTemplateDetailOptions } from '../template.types'
import AbstractField from './AbstractField'

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
	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<IDateTimeFieldDefinition>
	) {
		return {
			valueType: `${options.importAs}.IDateTimeFieldValue${
				options.definition.isArray ? '[]' : ''
			}`
		}
	}
}
