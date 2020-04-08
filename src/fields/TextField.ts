import AbstractField, { IFieldDefinition } from './AbstractField'
import { FieldDefinition, FieldType } from './types'

export interface ITextFieldDefinition extends IFieldDefinition {
	/** * .Text - plain text */
	type: FieldType.Text
	value?: string
	defaultValue?: string
	options?: {
		/** The minimum length we'll allow of this field */
		minLength?: number
		/** The max length possible with this string */
		maxLength?: number
	}
}

export default class TextField<
	T extends FieldDefinition = ITextFieldDefinition
> extends AbstractField<T> {
	public static templateDetails() {
		return {
			valueType: 'string'
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
