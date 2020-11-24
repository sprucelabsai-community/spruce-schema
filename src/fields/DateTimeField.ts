import {
	FieldTemplateDetailOptions,
	FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { DateTimeFieldDefinition } from './DateTimeField.types'

export default class DateTimeField extends AbstractField<DateTimeFieldDefinition> {
	public static get description() {
		return 'Date and time support.'
	}
	public static generateTemplateDetails(
		options: FieldTemplateDetailOptions<DateTimeFieldDefinition>
	): FieldTemplateDetails {
		return {
			valueType: `${options.importAs}.IDateTimeFieldValue${
				options.definition.isArray ? '[]' : ''
			}`,
		}
	}
}
