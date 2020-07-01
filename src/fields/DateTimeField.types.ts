import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { IFieldDefinition } from '../schema.types'

export interface IDateTimeFieldValue {
	gmt: string
}

export type IDateTimeFieldDefinition = IFieldDefinition<IDateTimeFieldValue> & {
	/** * A date/time field that stores everything in GMT and handles all the timezone */
	type: FieldType.DateTime
	options?: { dateTimeFormat?: string }
}
