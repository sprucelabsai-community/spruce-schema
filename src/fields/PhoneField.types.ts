import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { IFieldDefinition } from './field.static.types'

export type IPhoneFieldDefinition = IFieldDefinition<
	string,
	string,
	string[],
	string[]
> & {
	/** * .Phone a great way to validate and format values */
	type: FieldType.Phone
	options?: {}
}
