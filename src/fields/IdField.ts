import { FieldType } from '.'
import BaseField, { IBaseFieldDefinition } from './BaseField'

export interface IIdFieldDefinition extends IBaseFieldDefinition {
	/** * .Id - Any string based uniq id */
	type: FieldType.Id
	value?: string
	defaultValue?: string
	options?: {}
}

export default class IdField extends BaseField<IIdFieldDefinition> {
	public static templateDetails() {
		return {
			definitionInterface: 'IIdFieldDefinition',
			valueType: 'string'
		}
	}
}
