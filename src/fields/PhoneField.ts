import AbstractField from './AbstractField'
import { FieldType } from '#spruce:schema/fields/fieldType'
import PhoneNumber from '../utilities/PhoneNumberUtility'
import { IFieldTemplateDetailOptions } from '../template.types'
import { IValidateOptions, IFieldDefinition } from '../schema.types'

export type IPhoneFieldDefinition = IFieldDefinition<string> & {
	/** * .Phone a great way to validate and format values */
	type: FieldType.Phone
	options?: {}
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

	public validate(value: any, options: IValidateOptions) {
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
