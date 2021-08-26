import * as EmailValidator from 'email-validator'
import {
	FieldTemplateDetailOptions,
	FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { EmailFieldDefinition } from './EmailField.types'
import { ValidateOptions } from './field.static.types'

export default class EmailField extends AbstractField<EmailFieldDefinition> {
	public static get description() {
		return 'Email support.'
	}

	public static generateTemplateDetails(
		options: FieldTemplateDetailOptions<EmailFieldDefinition>
	): FieldTemplateDetails {
		return {
			valueType: `string${options.definition.isArray ? '[]' : ''}`,
		}
	}

	public validate(value: any, options?: ValidateOptions<EmailFieldDefinition>) {
		const errors = super.validate(value, options)

		if (!EmailValidator.validate(value)) {
			errors.push({ code: 'INVALID_PARAMETER', name: this.name })
		}

		return errors
	}
}
