import { IFieldDefinition } from '../schema.types'
import { IFieldTemplateDetailOptions } from '../template.types'
import AbstractField from './AbstractField'
import FieldType from '#spruce:schema/fields/fieldType'

export type INumberFieldDefinition = IFieldDefinition<number> & {
	/** * .Number - a number, silly */
	type: FieldType.Number

	/** Configure this field */
	options?: {
		min?: number
		max?: number
	}
}

export default class NumberField extends AbstractField<INumberFieldDefinition> {
	public static get description() {
		return 'Handles all types of numbers with min/max and clamp support'
	}

	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<INumberFieldDefinition>
	) {
		return {
			valueType: `number${options.definition.isArray ? '[]' : ''}`
		}
	}

	// TODO clamp and validate
	public toValueType(value: any): number {
		return +value
	}
}
