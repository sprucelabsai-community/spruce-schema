import { FieldType } from '#spruce:schema/fields/fieldType'
import AbstractField, { IFieldDefinition } from './AbstractField'

export type INumberFieldDefinition = IFieldDefinition<number> & {
	/** * .Number - a number, silly */
	type: FieldType.Number
}

export default class NumberField extends AbstractField<INumberFieldDefinition> {
	public static templateDetails() {
		return {
			valueType: 'number',
			description: 'Casts things to numbers. String numbers are supported.'
		}
	}
	public toValueType(value: any): number {
		return +value
	}
}
