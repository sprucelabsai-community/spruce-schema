import { FieldType } from '#spruce:schema/fields/fieldType'
import AbstractField, { IFieldDefinition } from './AbstractField'

/** A duration value object */
export interface IDurationFieldValue {
	hours: number
	minutes: number
	seconds: number
	ms: number
}

export interface IDurationFieldDefinition extends IFieldDefinition {
	/** * .Duration - a span of time down to the ms */
	type: FieldType.Duration
	value?: IDurationFieldValue
	defaultValue?: IDurationFieldValue
	options?: {
		/** How it should be rendered, defaults to {{h}}h{{m}}min */
		durationFormat?: string
		/** The minimum duration we'll allow of this field */
		minDuration?: IDurationFieldValue
		/** The max duration possible with this field */
		maxDuration?: IDurationFieldValue
	}
}

export default class DurationField extends AbstractField<
	IDurationFieldDefinition
> {
	public static templateDetails() {
		return {
			valueType: 'IDurationFieldValue'
		}
	}
}
