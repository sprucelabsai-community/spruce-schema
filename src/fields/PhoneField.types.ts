import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { IFieldDefinition } from '../schema.types'

export type IPhoneFieldDefinition = IFieldDefinition<string> & {
	/** * .Phone a great way to validate and format values */
	type: FieldType.Phone
	options?: {}
}
