import {
	IFieldTemplateDetailOptions,
	IFieldTemplateDetails,
} from '../types/template.types'
import formatPhoneNumber from '../utilities/formatPhoneNumber'
import AbstractField from './AbstractField'
import { ValidateOptions } from './field.static.types'
import { IPhoneFieldDefinition } from './PhoneField.types'

export default class PhoneField extends AbstractField<IPhoneFieldDefinition> {
	public static get description() {
		return 'Takes anything close to a phone number and formats it. Also great at validating numbers.'
	}

	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<IPhoneFieldDefinition>
	): IFieldTemplateDetails {
		return {
			valueType: `string${options.definition.isArray ? '[]' : ''}`,
		}
	}

	public toValueType(value: any): string {
		const stringValue = `${value}`
		const phoneNumber = formatPhoneNumber(stringValue)
		return phoneNumber
	}

	public validate(
		value: any,
		options?: ValidateOptions<IPhoneFieldDefinition>
	) {
		const errors = super.validate(value, options)

		try {
			typeof value !== 'undefined' && formatPhoneNumber(value, false)
		} catch (err) {
			errors.push({ code: 'invalid_value', name: this.name })
		}

		return errors
	}
}
