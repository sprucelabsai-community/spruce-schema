import { FieldDefinition } from './field.static.types'

export type PhoneFieldDefinition = FieldDefinition<
	string,
	string,
	string[],
	string[]
> & {
	/** * .Phone a great way to validate and format values */
	type: 'phone'
	// eslint-disable-next-line @typescript-eslint/ban-types
	options?: {}
}
