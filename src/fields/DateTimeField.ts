import { FieldError } from '../errors/options.types'
import {
	FieldTemplateDetailOptions,
	FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { validateDateValue } from './DateField'
import { DateTimeFieldDefinition } from './DateTimeField.types'
import { ValidateOptions } from './field.static.types'

export default class DateTimeField extends AbstractField<DateTimeFieldDefinition> {
	public static get description() {
		return 'Date and time support.'
	}

	public static generateTemplateDetails(
		options: FieldTemplateDetailOptions<DateTimeFieldDefinition>
	): FieldTemplateDetails {
		return {
			valueType: `${options.importAs}.DateTimeFieldValue${
				options.definition.isArray ? '[]' : ''
			}`,
		}
	}

	public validate(
		value: any,
		options?: ValidateOptions<DateTimeFieldDefinition>
	): FieldError[] {
		const errors = super.validate(value, options)
		if (errors.length > 0) {
			return errors
		}

		return validateDateValue({
			value,
			isRequired: this.isRequired,
			name: this.name,
		})
	}

	public toValueType(value: any) {
		if (value instanceof Date) {
			return value.getTime()
		}

		return value ? +value : value
	}
}
