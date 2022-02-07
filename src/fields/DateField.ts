import { FieldError } from '../errors/options.types'
import {
	FieldTemplateDetailOptions,
	FieldTemplateDetails,
} from '../types/template.types'
import getStartOfDay from '../utilities/getStartOfDay'
import isUndefinedOrNull from '../utilities/isUndefinedOrNull'
import AbstractField from './AbstractField'
import { DateFieldDefinition } from './DateField.types'
import { ValidateOptions } from './field.static.types'

export default class DateField extends AbstractField<DateFieldDefinition> {
	public static get description() {
		return 'Date and time support.'
	}
	public static generateTemplateDetails(
		options: FieldTemplateDetailOptions<DateFieldDefinition>
	): FieldTemplateDetails {
		return {
			valueType: `${options.importAs}.DateFieldValue${
				options.definition.isArray ? '[]' : ''
			}`,
		}
	}

	public validate(
		value: any,
		options?: ValidateOptions<DateFieldDefinition>
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
		return getStartOfDay(value)
	}
}

export function validateDateValue(options: {
	value: any
	isRequired: boolean
	name: string
}): FieldError[] {
	const { value, isRequired, name } = options

	if (isUndefinedOrNull(value) && !isRequired) {
		return []
	}

	if (typeof value === 'number' || value instanceof Date) {
		return []
	} else {
		return [
			{
				name,
				code: 'INVALID_PARAMETER',
				friendlyMessage: `This doesn't look like a date to me!`,
			},
		]
	}
}
