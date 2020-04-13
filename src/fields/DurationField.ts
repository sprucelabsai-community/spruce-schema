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
			valueType: 'IDurationFieldValue',
			description:
				'A span of time represented in { hours, minutes, seconds, ms }'
		}
	}

	public toValueType(value: any): IDurationFieldValue {
		let totalMs = 0

		if (typeof value === 'number') {
			totalMs = value
		} else if (typeof value === 'object') {
			totalMs += typeof value.ms === 'number' ? value.ms : 0
			totalMs += typeof value.seconds === 'number' ? value.seconds * 1000 : 0
			totalMs +=
				typeof value.minutes === 'number' ? value.minutes * 1000 * 60 : 0
			totalMs +=
				typeof value.hours === 'number' ? value.hours * 1000 * 60 * 60 : 0
		}

		const ms = totalMs % 1000
		totalMs = (totalMs - ms) / 1000
		const seconds = totalMs % 60
		totalMs = (totalMs - seconds) / 60
		const minutes = totalMs % 60
		const hours = (totalMs - minutes) / 60

		return { hours, minutes, seconds, ms }
	}
}
