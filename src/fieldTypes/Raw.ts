import { FieldType } from '.'
import FieldBase, { IFieldBaseDefinition } from './Base'

export interface IFieldRawDefinition extends IFieldBaseDefinition {
	type: FieldType.Raw
	value?: any
	defaultValue?: any
	options: {
		interfaceName: string
	}
}

export default class FieldRaw extends FieldBase<IFieldRawDefinition> {
	public definitionInterfaceString = 'IFieldRawDefinition'
	public typeEnumString = 'FieldType.Raw'
}
