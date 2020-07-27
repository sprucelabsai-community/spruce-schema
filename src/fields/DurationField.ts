import { IInvalidFieldError } from '../errors/error.types'
import SpruceError from '../errors/SpruceError'
import { IFieldTemplateDetailOptions } from '../template.types'
import AbstractField from './AbstractField'
import {
	IDurationFieldDefinition,
	IDurationFieldValue,
} from './DurationField.types'
import { ValidateOptions } from './field.static.types'
import { ITextFieldDefinition } from './TextField.types'

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
		throw new SpruceError({
			code: 'INVALID_FIELD',
			schemaId: 'na',
			errors: [
				{
					code: 'failed_to_parse_to_date',
					name: 'na',
					friendlyMessage: `Could not turn ${value} into IDurationFieldValue`,
				},
			],
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

export default class DurationField extends AbstractField<
	IDurationFieldDefinition
> {
	public static get description() {
		return 'A span of time represented in { hours, minutes, seconds, ms }'
	}

	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<IDurationFieldDefinition>
	) {
		return {
			valueType: `${options.importAs}.IDurationFieldValue${
				options.definition.isArray ? '[]' : ''
			}`,
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
				friendlyMessage: err.options?.friendlyMessage,
			})
		}

		return errors
	}

	public toValueType(value: any): IDurationFieldValue {
		return buildDuration(value)
	}
}
