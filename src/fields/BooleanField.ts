import BaseField, { IBaseFieldDefinition } from './BaseField'
import { FieldType } from './types'

export interface IBooleanFieldDefinition extends IBaseFieldDefinition {
	/** * .Boolean - true/false */
	type: FieldType.Boolean
	value?: boolean
	defaultValue?: boolean
	options?: {}
}

export default class BooleanField extends BaseField<IBooleanFieldDefinition> {
	public static templateDetails() {
		return {
			definitionInterface: 'IBooleanFieldDefinition',
			valueType: 'boolean'
		}
	}
	/** * Turn everything into a string */
	public toValueType(value: any): boolean {
		return !!value
	}
}
