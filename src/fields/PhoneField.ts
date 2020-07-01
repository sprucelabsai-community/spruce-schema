import { ValidateOptions } from '../schema.types'
import { IFieldTemplateDetailOptions } from '../template.types'
import PhoneNumber from '../utilities/PhoneNumberUtility'
import AbstractField from './AbstractField'
import { IPhoneFieldDefinition } from './PhoneField.types'

export default class PhoneField extends AbstractField<IPhoneFieldDefinition> {
	public static get description() {
		return 'Takes anything close to a phone number and formats it. Also great at validating numbers.'
	}
	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<IPhoneFieldDefinition>
	) {
		return {
			valueType: `string${options.definition.isArray ? '[]' : ''}`
		}
	}

	public toValueType(value: any): string {
		const stringValue = `${value}`
		const phoneNumber = PhoneNumber.format(stringValue)
		return phoneNumber
	}

	public validate(
		value: any,
		options?: ValidateOptions<IPhoneFieldDefinition>
	) {
		// Debugger
		const errors = super.validate(value, options)

		try {
			// Only check if it's defined
			typeof value !== 'undefined' && PhoneNumber.format(value, false)
		} catch (err) {
			errors.push({ code: 'invalid_phone_number', name: this.name })
		}

		return errors
	}
}
