import { IBaseFieldDefinition } from './BaseField'
import { FieldType } from './types'
import TextField from './TextField'
import PhoneNumber from '../utilities/PhoneNumberUtility'

export interface IPhoneFieldDefinition extends IBaseFieldDefinition {
	/** * .Phone - a phone number */
	type: FieldType.Phone
	value?: string
	defaultValue?: string
	options?: {
		/** The format we should use, defaults to +1 (555)-555-5555 */
		phoneNumberFormat?: string
	}
}

export default class PhoneField extends TextField<IPhoneFieldDefinition> {
	public static templateDetails() {
		return {
			definitionInterface: 'IPhoneFieldDefinition',
			valueType: 'string'
		}
	}

	public toValueType(value: any): string {
		const stringValue = super.toValueType(value)
		const phoneNumber = PhoneNumber.format(stringValue)
		return phoneNumber
	}

	public validate(value: any) {
		// Debugger
		const errors = super.validate(value)

		try {
			// Only check if it's defined
			typeof value !== 'undefined' && PhoneNumber.format(value, false)
		} catch (err) {
			errors.push('invalid_phone_number')
		}

		return errors
	}
}
