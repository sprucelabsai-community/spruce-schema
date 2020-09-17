import { IFieldDefinition } from './field.static.types'

export type INumberFieldDefinition = IFieldDefinition<
	number,
	number,
	number[],
	number[]
> & {
	/** * .Number - a number, silly */
	type: 'number'

	/** Configure this field */
	options?: {
		min?: number
		max?: number
	}
}
