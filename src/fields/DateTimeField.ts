import {
	IFieldTemplateDetailOptions,
	IFieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { IDateTimeFieldDefinition } from './DateTimeField.types'

export default class DateTimeField extends AbstractField<IDateTimeFieldDefinition> {
	public static get description() {
		return 'Date and time support.'
	}
	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<IDateTimeFieldDefinition>
	): IFieldTemplateDetails {
		return {
			valueType: `${options.importAs}.IDateTimeFieldValue${
				options.definition.isArray ? '[]' : ''
			}`,
		}
	}
}
