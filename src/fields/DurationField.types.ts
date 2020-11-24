import { FieldDefinition } from './field.static.types'

/** A duration value object */
export interface IDurationFieldValue {
	hours: number
	minutes: number
	seconds: number
	ms: number
}

export type IDurationFieldDefinition = FieldDefinition<IDurationFieldValue> & {
	/** * .Duration - a span of time  */
	type: 'duration'
	options?: {
		/** How it should be rendered, defaults to {{h}}h{{m}}min */
		durationFormat?: string
		/** The minimum duration we'll allow of this field */
		minDuration?: IDurationFieldValue
		/** The max duration possible with this field */
		maxDuration?: IDurationFieldValue
	}
}
