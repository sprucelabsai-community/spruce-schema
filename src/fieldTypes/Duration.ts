import { FieldType } from '.'
import FieldBase, { IFieldBaseDefinition } from './Base'

/** a duration value object */
export interface IFieldDurationValue {
	hours: number
	minutes: number
	seconds: number
	ms: number
}

export interface IFieldDurationDefinition extends IFieldBaseDefinition {
	type: FieldType.Duration
	value?: IFieldDurationValue
	defaultValue?: IFieldDurationValue
	options?: {
		/** how it should be rendered, defaults to {{h}}h{{m}}min */
		durationFormat?: string
		/** the minimum duration we'll allow of this field */
		minDuration?: IFieldDurationValue
		/** the max duration possible with this field */
		maxDuration?: IFieldDurationValue
	}
}

export default class FieldDuration extends FieldBase<IFieldDurationDefinition> {
	public definitionInterfaceString = 'IFieldDurationDefinition'
	public typeEnumString = 'FieldType.Duration'
}
