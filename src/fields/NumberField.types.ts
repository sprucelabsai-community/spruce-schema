import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { IFieldDefinition } from './field.static.types'

export type INumberFieldDefinition = IFieldDefinition<
	number,
	number,
	number[],
	number[]
> & {
	/** * .Number - a number, silly */
	type: FieldType.Number

	/** Configure this field */
	options?: {
		min?: number
		max?: number
	}
}
