import SpruceError from '../errors/SpruceError'
import {
	IFieldTemplateDetails,
	FieldTemplateDetailOptions,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { ToValueTypeOptions } from './field.static.types'
import { ITextFieldDefinition } from './TextField.types'

export default class TextField extends AbstractField<ITextFieldDefinition> {
	public static get description() {
		return 'A text field. Converts non-strings into strings by calling toString(). Size set by options.'
	}

	public static generateTemplateDetails(
		options: FieldTemplateDetailOptions<ITextFieldDefinition>
	): IFieldTemplateDetails {
		const { definition } = options
		return {
			valueType: `string${definition.isArray ? '[]' : ''}`,
		}
	}

	public toValueType<C extends boolean>(
		value: any,
		options?: ToValueTypeOptions<ITextFieldDefinition, C>
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
