import { InvalidFieldError } from '../errors/error.types'
import SpruceError from '../errors/SpruceError'
import {
	FieldTemplateDetailOptions,
	FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { NumberFieldDefinition } from './NumberField.types'

export default class NumberField extends AbstractField<NumberFieldDefinition> {
	public static get description() {
		return 'Handles all types of numbers with min/max and clamp support'
	}

	public static generateTemplateDetails(
		options: FieldTemplateDetailOptions<NumberFieldDefinition>
	): FieldTemplateDetails {
		return {
			valueType: `number${options.definition.isArray ? '[]' : ''}`,
		}
	}

	public toValueType(value: any): number {
		const numberValue = +value
		if (isNaN(numberValue)) {
			throw new SpruceError({
				code: 'TRANSFORMATION_ERROR',
				fieldType: 'number',
				incomingTypeof: typeof value,
				incomingValue: value,
				errors: [
					this.buildNaNError(
						`${JSON.stringify(value)} could not be converted to a number.`
					),
				],
				name: this.name,
			})
		}

		return numberValue
	}

	private buildNaNError(msg: string): InvalidFieldError {
		return {
			error: new Error(msg),
			code: 'invalid_value',
			name: this.name,
		}
	}

	public validate(value: any, options: any) {
		const errors = super.validate(value, options)

		if (errors.length === 0) {
			if (isNaN(value)) {
				errors.push(
					this.buildNaNError(`"${JSON.stringify(value)}" is not a number!`)
				)
			}
		}

		return errors
	}
}
