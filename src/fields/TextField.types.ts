import { FieldDefinition } from './field.static.types'

export type TextFieldDefinition = FieldDefinition<
	string,
	string,
	string[],
	string[]
> & {
	/** * Text field */
	type: 'text'
	/** Options */
	options?: {
		/** The minimum length we'll allow of this field */
		minLength?: number
		/** The max length possible with this string */
		maxLength?: number
	}
}
