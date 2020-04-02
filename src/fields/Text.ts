import FieldBase, { IFieldBaseDefinition } from './Base'
import { IFieldDefinition, FieldType } from './types'

export interface IFieldTextDefinition extends IFieldBaseDefinition {
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

export default class FieldText<
	T extends IFieldDefinition = IFieldDefinition
> extends FieldBase<T> {
	public static templateDetails() {
		return {
			definitionInterface: 'IFieldTextDefinition',
			valueType: 'string'
		}
	}

	/** Tranform to match the value type of string */
	public toValueType(value: any): string {
		const transformed =
			typeof value === 'string' ? value : value && value.toString()

		if (typeof transformed === 'string') {
			return transformed
		}

		throw new Error(`"${value}" is not transformable to a string`)
	}
}
