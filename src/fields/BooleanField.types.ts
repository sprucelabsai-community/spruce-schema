import { FieldDefinition } from './field.static.types'

export type BooleanFieldDefinition = FieldDefinition<
	boolean,
	boolean,
	boolean[],
	boolean[]
> & {
	/** * A true/false field */
	type: 'boolean'
}
