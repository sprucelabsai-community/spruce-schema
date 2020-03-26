import FieldBase, { IFieldBaseDefinition } from './Base'
import { IFieldDefinition, FieldType } from './types'

export interface IFieldTextDefinition extends IFieldBaseDefinition {
	type: FieldType.Text
	value?: string
	defaultValue?: string
	options?: {
		/** the minimum length we'll allow of this field */
		minLength?: number
		/** the max length possible with this string */
		maxLength?: number
	}
}

export default class FieldText<
	T extends IFieldDefinition = IFieldDefinition
> extends FieldBase<T> {
	public static templateDetails() {
		return {
			definitionInterface: 'IFieldTextDefinition',
			typeEnum: 'FieldType.Text',
			valueType: 'string'
		}
	}

	/** tranform to match the value type of string */
	public toValueType = (value: any): string => {
		const transformed =
			typeof value === 'string' ? value : value && value.toString()

		if (typeof transformed === 'string') {
			return transformed
		}

		throw new Error(`"${value}" is not transformable to a string`)
	}
}
