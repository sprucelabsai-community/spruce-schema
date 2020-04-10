import { FieldType } from '#spruce:fieldTypes'
import AbstractField, { IFieldDefinition } from './AbstractField'

export interface INumberFieldDefinition extends IFieldDefinition {
	/** * .Number - Any number */
	type: FieldType.Number
	value?: number
	defaultValue?: number
}

export default class NumberField extends AbstractField<INumberFieldDefinition> {
	public static templateDetails() {
		return {
			valueType: 'number'
		}
	}
}
