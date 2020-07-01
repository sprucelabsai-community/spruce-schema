import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { IFieldDefinition } from '../schema.types'
import { IFieldTemplateDetailOptions } from '../template.types'
import AbstractField from './AbstractField'

export interface IDateFieldValue extends Date {}

export type IDateFieldDefinition = IFieldDefinition<IDateFieldValue> & {
	/** * A date/time field that stores everything in GMT and handles all the timezone */
	type: FieldType.Date
	options?: { DateFormat?: string }
}

export default class DateField extends AbstractField<IDateFieldDefinition> {
	public static get description() {
		return 'Date and time support.'
	}
	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<IDateFieldDefinition>
	) {
		return {
			valueType: `${options.importAs}.IDateFieldValue${
				options.definition.isArray ? '[]' : ''
			}`
		}
	}
}
