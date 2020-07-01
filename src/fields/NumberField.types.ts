import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { IFieldDefinition } from '../schema.types'

export type INumberFieldDefinition = IFieldDefinition<number> & {
	/** * .Number - a number, silly */
	type: FieldType.Number

	/** Configure this field */
	options?: {
		min?: number
		max?: number
	}
}
