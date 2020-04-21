import AbstractField, { IFieldDefinition } from './AbstractField'
import { FieldType } from '#spruce:schema/fields/fieldType'
import PhoneNumber from '../utilities/PhoneNumberUtility'
import { IFieldTemplateDetailOptions } from '../template.types'

export type IPhoneFieldDefinition = IFieldDefinition<string> & {
	/** * .Phone a great way to validate and format values */
	type: FieldType.Phone
	options?: {
		/** The format we should use, defaults to +1 (555)-555-5555 */
		phoneNumberFormat?: string
	}
}

export default class PhoneField extends AbstractField<IPhoneFieldDefinition> {
	public static get description() {
		return 'Takes anything close to a phone number and formats it. Also great at validating numbers.'
	}
	public static templateDetails(
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
