import AbstractField, {
	IFieldDefinition,
	IFieldTemplateDetails
} from './AbstractField'
import { FieldType } from '#spruce:schema/fields/fieldType'

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
	public static templateDetails(): IFieldTemplateDetails {
		return {
			valueType: 'string',
			description:
				'A text field. Converts non-strings into strings by calling toString(). Size set by options.'
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
