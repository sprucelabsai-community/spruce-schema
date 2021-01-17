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
		options: ValidateOptions<F>
	): InvalidFieldError[] {
		const errors = super.validate(value, options)

		if (errors.length === 0) {
			if (this.isRequired && `${value}`.length === 0) {
				errors.push({
					code: 'missing_required',
					friendlyMessage: `${this.label ?? this.name} can't be empty!`,
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
		let transformed =
			typeof value === 'string'
				? value
				: typeof value === 'number' &&
				  value &&
				  value.toString &&
				  value.toString()

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
}
