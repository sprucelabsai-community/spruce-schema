import { FieldDefinition } from './field.static.types'

export type IBooleanFieldDefinition = FieldDefinition<
	boolean,
	boolean,
	boolean[],
	boolean[]
> & {
	/** * A true/false field */
	type: 'boolean'
}
