import { ToValueTypeOptions } from '../schema.types'
import {
	IFieldTemplateDetails,
	IFieldTemplateDetailOptions
} from '../template.types'
import AbstractField from './AbstractField'
import { ITextFieldDefinition } from './TextField.types'

export default class TextField extends AbstractField<ITextFieldDefinition> {
	public static get description() {
		return 'A text field. Converts non-strings into strings by calling toString(). Size set by options.'
	}

	/** Generate template details */
	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<ITextFieldDefinition>
	): IFieldTemplateDetails {
		const { definition } = options
		return {
			valueType: `string${definition.isArray ? '[]' : ''}`
		}
	}

	/** * Transform to match the value type of string */
	public toValueType<C extends boolean>(
		value: any,
		options?: ToValueTypeOptions<ITextFieldDefinition, C>
	): string {
		let transformed =
			typeof value === 'string'
				? value
				: value && value.toString && value.toString()

		if (typeof transformed === 'string') {
			const maxLength = options?.maxLength ?? 0

			if (maxLength > 0 && transformed.length > maxLength) {
				transformed = transformed.substr(0, maxLength)
			}
			return transformed
		}

		throw new Error(`"${value}" is not transformable to a string`)
	}
}
