import { FieldType } from './types'
import AbstractField, { IFieldDefinition } from './AbstractField'

export interface IIdFieldDefinition extends IFieldDefinition {
	/** * .Id - Any string based uniq id */
	type: FieldType.Id
	value?: string
	defaultValue?: string
	options?: {}
}

export default class IdField extends AbstractField<IIdFieldDefinition> {
	public static templateDetails() {
		return {
			valueType: 'string'
		}
	}
}
