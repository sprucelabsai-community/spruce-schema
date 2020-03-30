import { FieldType } from '.'
import FieldBase, { IFieldBaseDefinition } from './Base'

/** A duration value object */
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
		/** How it should be rendered, defaults to {{h}}h{{m}}min */
		durationFormat?: string
		/** The minimum duration we'll allow of this field */
		minDuration?: IFieldDurationValue
		/** The max duration possible with this field */
		maxDuration?: IFieldDurationValue
	}
}

export default class FieldDuration extends FieldBase<IFieldDurationDefinition> {
	public static templateDetails() {
		return {
			definitionInterface: 'IFieldDurationDefinition',
			valueType: 'IFieldDurationValue'
		}
	}
}
