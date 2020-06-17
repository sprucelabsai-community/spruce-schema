import FieldType from '#spruce:schema/fields/fieldType'
import AbstractField from './AbstractField'
import { IFieldDefinition, ValidateOptions } from '../schema.types'
import { IInvalidFieldError } from '../errors/error.types'
import { IFieldTemplateDetailOptions } from '../template.types'
import SchemaError from '../errors/SchemaError'
import { ErrorCode } from '../errors/error.types'
import { ITextFieldDefinition } from './TextField'

/** A duration value object */
export interface IDurationFieldValue {
	hours: number
	minutes: number
	seconds: number
	ms: number
}

/** Build a duration object by sending a number (treated as ms) or an object with  */
export function buildDuration(
	value: string | number | Partial<IDurationFieldValue>
): IDurationFieldValue {
	let totalMs = 0

	if (typeof value === 'string') {
		totalMs = parseInt(value, 10)
	} else if (typeof value === 'number') {
		totalMs = value
	} else if (typeof value === 'object') {
		totalMs += typeof value.ms === 'number' ? value.ms : 0
		totalMs += typeof value.seconds === 'number' ? value.seconds * 1000 : 0
		totalMs += typeof value.minutes === 'number' ? value.minutes * 1000 * 60 : 0
		totalMs +=
			typeof value.hours === 'number' ? value.hours * 1000 * 60 * 60 : 0
	}

	if (typeof totalMs !== 'number') {
		throw new SchemaError({
			code: ErrorCode.InvalidField,
			schemaId: 'na',
			errors: [
				{
					code: 'failed_to_parse_to_date',
					name: 'na',
					friendlyMessage: `Could not turn ${value} into IDurationFieldValue`
				}
			]
		})
	}

	const ms = totalMs % 1000
	totalMs = (totalMs - ms) / 1000
	const seconds = totalMs % 60
	totalMs = (totalMs - seconds) / 60
	const minutes = totalMs % 60
	const hours = (totalMs - minutes) / 60

	return { hours, minutes, seconds, ms }
}

export type IDurationFieldDefinition = IFieldDefinition<IDurationFieldValue> & {
	/** * .Duration - a span of time  */
	type: FieldType.Duration
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
	public static get description() {
		return 'A span of time represented in { hours, minutes, seconds, ms }'
	}

	public static templateDetails(
		options: IFieldTemplateDetailOptions<IDurationFieldDefinition>
	) {
		return {
			valueType: `${options.importAs}.IDurationFieldValue${
				options.definition.isArray ? '[]' : ''
			}`
		}
	}

	public validate(
		value: any,
		_?: ValidateOptions<ITextFieldDefinition>
	): IInvalidFieldError[] {
		const errors: IInvalidFieldError[] = []
		try {
			buildDuration(value)
		} catch (err) {
			errors.push({
				code: err.options?.code || 'failed_to_parse_to_date',
				name: this.name,
				error: err,
				friendlyMessage: err.options?.friendlyMessage
			})
		}

		return errors
	}

	public toValueType(value: any): IDurationFieldValue {
		return buildDuration(value)
	}
}
