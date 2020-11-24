import {
	FieldTemplateDetailOptions,
	IFieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { IDateFieldDefinition } from './DateField.types'

export default class DateField extends AbstractField<IDateFieldDefinition> {
	public static get description() {
		return 'Date and time support.'
	}
	public static generateTemplateDetails(
		options: FieldTemplateDetailOptions<IDateFieldDefinition>
	): IFieldTemplateDetails {
		return {
			valueType: `${options.importAs}.IDateFieldValue${
				options.definition.isArray ? '[]' : ''
			}`,
		}
	}
}
