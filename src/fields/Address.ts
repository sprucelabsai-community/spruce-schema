import { FieldType } from './index'
import FieldBase, { IFieldBaseDefinition } from './Base'

export interface IFieldAddressValue {
	street1: string
	street2?: string
	city: string
	province: string
	country: string
	zip: string
}

export interface IFieldAddressDefinition extends IFieldBaseDefinition {
	type: FieldType.Address
	value?: IFieldAddressValue
	defaultValue?: IFieldAddressValue
	options?: {}
}

export default class FieldAddress extends FieldBase<IFieldAddressDefinition> {
	public static templateDetails() {
		return {
			definitionInterface: 'IFieldAddressDefinition',
			valueType: 'IFieldAddressValue'
		}
	}
}
