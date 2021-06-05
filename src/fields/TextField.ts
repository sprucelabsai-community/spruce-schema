import { InvalidFieldError } from '../errors/error.types'
import SpruceError from '../errors/SpruceError'
import {
	FieldTemplateDetails,
	FieldTemplateDetailOptions,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { ToValueTypeOptions, ValidateOptions } from './field.static.types'
import { TextFieldDefinition } from './TextField.types'

export default class TextField extends AbstractField<TextFieldDefinition> {
	public static get description() {
		return 'A text field. Converts non-strings into strings by calling toString(). Size set by options.'
	}

	public static generateTemplateDetails(
		options: FieldTemplateDetailOptions<TextFieldDefinition>
	): FieldTemplateDetails {
		const { definition } = options
		return {
			valueType: `string${definition.isArray ? '[]' : ''}`,
		}
	}

	public validate(
		value: any,
		options: ValidateOptions<TextFieldDefinition>
	): InvalidFieldError[] {
		const errors = super.validate(value, options)

		if (errors.length === 0) {
			if (value && typeof this.convertToString(value) !== 'string') {
				errors.push({
					code: 'invalid_value',
					name: this.name,
					friendlyMessage: `${this.name} should be a string!`,
				})
			}
			if (this.isRequired && `${value}`.length === 0) {
				errors.push({
					code: 'missing_required',
					friendlyMessage: `${this.name} can't be empty!`,
					name: this.name,
				})
			}
		}

		return errors
	}

	public toValueType<C extends boolean>(
		value: any,
		options?: ToValueTypeOptions<TextFieldDefinition, C>
	): string {
		let transformed = this.convertToString(value)

		if (typeof transformed === 'string') {
			const maxLength = options?.maxLength ?? 0

			if (maxLength > 0 && transformed.length > maxLength) {
				transformed = transformed.substr(0, maxLength)
			}
			return transformed
		}

		throw new SpruceError({
			code: 'TRANSFORMATION_ERROR',
			fieldType: 'text',
			incomingTypeof: typeof value,
			incomingValue: value,
			errors: [
				{
					error: new Error(
						`${JSON.stringify(value)} could not be converted to a string.`
					),
					code: 'invalid_value',
					name: this.name,
				},
			],
			name: this.name,
		})
	}

	private convertToString(value: any) {
		return typeof value === 'string'
			? value
			: typeof value === 'number' && value && value.toString && value.toString()
	}
}
