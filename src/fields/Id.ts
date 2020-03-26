import { FieldType } from '.'
import FieldBase, { IFieldBaseDefinition } from './Base'

export interface IFieldIdDefinition extends IFieldBaseDefinition {
	type: FieldType.Id
	value?: string
	defaultValue?: string
	options?: {}
}

export default class FieldId extends FieldBase<IFieldIdDefinition> {
	public static templateDetails() {
		return {
			definitionInterface: 'IFieldIdDefinition',
			typeEnum: 'FieldType.Id',
			valueType: 'string'
		}
	}
}
