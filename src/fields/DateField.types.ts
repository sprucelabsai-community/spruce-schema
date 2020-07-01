import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { IFieldDefinition } from '../schema.types'

export interface IDateFieldValue extends Date {}

export type IDateFieldDefinition = IFieldDefinition<IDateFieldValue> & {
	/** * A date/time field that stores everything in GMT and handles all the timezone */
	type: FieldType.Date
	options?: { DateFormat?: string }
}
