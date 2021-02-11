import { FieldDefinition } from './field.static.types'

export type EmailFieldDefinition = FieldDefinition<
	string,
	string,
	string[],
	string[]
> & {
	/** * .Email an easy way to capture emails */
	type: 'email'
	// eslint-disable-next-line @typescript-eslint/ban-types
	options?: {}
}
