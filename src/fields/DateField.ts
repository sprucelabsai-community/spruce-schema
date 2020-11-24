import {
	FieldTemplateDetailOptions,
	FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { DateFieldDefinition } from './DateField.types'

export default class DateField extends AbstractField<DateFieldDefinition> {
	public static get description() {
		return 'Date and time support.'
	}
	public static generateTemplateDetails(
		options: FieldTemplateDetailOptions<DateFieldDefinition>
	): FieldTemplateDetails {
		return {
			valueType: `${options.importAs}.IDateFieldValue${
				options.definition.isArray ? '[]' : ''
			}`,
		}
	}
}
