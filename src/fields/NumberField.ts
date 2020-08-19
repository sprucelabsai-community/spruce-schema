import {
	IFieldTemplateDetailOptions,
	IFieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { INumberFieldDefinition } from './NumberField.types'

export default class NumberField extends AbstractField<INumberFieldDefinition> {
	public static get description() {
		return 'Handles all types of numbers with min/max and clamp support'
	}

	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<INumberFieldDefinition>
	): IFieldTemplateDetails {
		return {
			valueType: `number${options.definition.isArray ? '[]' : ''}`,
		}
	}

	// TODO clamp and validate
	public toValueType(value: any): number {
		return +value
	}
}
