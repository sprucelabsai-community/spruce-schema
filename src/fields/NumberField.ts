import { FieldType } from '.'
import AbstractField, { IFieldDefinition } from './AbstractField'

export interface INumberFieldDefinition extends IFieldDefinition {
	/** * .Number - Any number */
	type: FieldType.Number
	value?: number
	defaultValue?: number
}

export default class NumberField<
	T extends INumberFieldDefinition = INumberFieldDefinition
> extends AbstractField<T> {
	public static templateDetails() {
		return {
			valueType: 'number'
		}
	}
}
