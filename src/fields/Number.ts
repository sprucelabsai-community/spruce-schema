import { FieldType } from '.'
import FieldBase, { IFieldBaseDefinition } from './Base'

export interface IFieldNumberDefinition extends IFieldBaseDefinition {
	type: FieldType.Number
	value?: number
	defaultValue?: number
}

export default class FieldNumber<
	T extends IFieldNumberDefinition = IFieldNumberDefinition
> extends FieldBase<T> {
	public static templateDetails() {
		return {
			definitionInterface: 'IFieldNumberDefinition',
			typeEnum: 'FieldType.Number',
			valueType: 'number'
		}
	}
}
