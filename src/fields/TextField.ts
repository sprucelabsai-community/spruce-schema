import AbstractField from './AbstractField'
import { IFieldDefinition } from '../schema.types'
import { FieldType } from '#spruce:schema/fields/fieldType'
import {
	IFieldTemplateDetails,
	IFieldTemplateDetailOptions
} from '../template.types'

export type ITextFieldDefinition = IFieldDefinition<string> & {
	/** * Text field */
	type: FieldType.Text
	/** Options */
	options?: {
		/** The minimum length we'll allow of this field */
		minLength?: number
		/** The max length possible with this string */
		maxLength?: number
	}
}

export default class TextField extends AbstractField<ITextFieldDefinition> {
	public static get description() {
		return 'A text field. Converts non-strings into strings by calling toString(). Size set by options.'
	}

	/** Generate template details */
	public static templateDetails(
		options: IFieldTemplateDetailOptions<ITextFieldDefinition>
	): IFieldTemplateDetails {
		const { definition } = options
		return {
			valueType: `string${definition.isArray ? '[]' : ''}`
		}
	}

	/** * Transform to match the value type of string */
	public toValueType(value: any): string {
		const transformed =
			typeof value === 'string'
				? value
				: value && value.toString && value.toString()

		if (typeof transformed === 'string') {
			return transformed
		}

		throw new Error(`"${value}" is not transformable to a string`)
	}
}
