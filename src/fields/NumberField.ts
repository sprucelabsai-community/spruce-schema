import { FieldType } from '.'
import BaseField, { IBaseFieldDefinition } from './BaseField'

export interface INumberFieldDefinition extends IBaseFieldDefinition {
	/** * .Number - Any number */
	type: FieldType.Number
	value?: number
	defaultValue?: number
}

export default class NumberField<
	T extends INumberFieldDefinition = INumberFieldDefinition
> extends BaseField<T> {
	public static templateDetails() {
		return {
			definitionInterface: 'INumberFieldDefinition',
			valueType: 'number'
		}
	}
}
