import { FieldType } from '.'
import BaseField, { IBaseFieldDefinition } from './BaseField'

export interface IRawFieldDefinition extends IBaseFieldDefinition {
	type: FieldType.Raw
	value?: any
	defaultValue?: any
	options: {
		interfaceName: string
	}
}

export default class RawField extends BaseField<IRawFieldDefinition> {
	public static templateDetails() {
		return {
			definitionInterface: 'IRawFieldDefinition',
			valueType: 'any'
		}
	}
}
