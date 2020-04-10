import AbstractField, { IFieldDefinition } from './AbstractField'
import { FieldType } from '#spruce:fieldTypes'

export interface IBooleanFieldDefinition extends IFieldDefinition {
	/** * .Boolean - true/false */
	type: FieldType.Boolean
	value?: boolean
	defaultValue?: boolean
	options?: {}
}

export default class BooleanField extends AbstractField<
	IBooleanFieldDefinition
> {
	public static templateDetails() {
		return {
			valueType: 'boolean'
		}
	}
	/** * Turn everything into a string */
	public toValueType(value: any): boolean {
		return !!value
	}
}
