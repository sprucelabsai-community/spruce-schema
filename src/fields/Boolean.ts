import FieldBase, { IFieldBaseDefinition } from './Base'
import { FieldType } from './types'

export interface IFieldBooleanDefinition extends IFieldBaseDefinition {
	type: FieldType.Boolean
	value?: boolean
	defaultValue?: boolean
	options?: {}
}

export default class FieldBoolean extends FieldBase<IFieldBooleanDefinition> {
	public definitionInterfaceString = 'IFieldBooleanDefinition'
	public typeEnumString = 'FieldType.Boolean'
}
