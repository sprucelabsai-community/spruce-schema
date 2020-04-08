import { FieldType } from '.'
import AbstractField, { IFieldDefinition } from './AbstractField'

export interface IRawFieldDefinition extends IFieldDefinition {
	type: FieldType.Raw
	value?: any
	defaultValue?: any
	options: {
		interfaceName: string
	}
}

export default class RawField extends AbstractField<IRawFieldDefinition> {
	public static templateDetails() {
		return {
			valueType: 'any'
		}
	}
}
