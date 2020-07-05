import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { IFieldDefinition } from './field.static.types'

export type IBooleanFieldDefinition = IFieldDefinition<
	boolean,
	boolean,
	boolean[],
	boolean[]
> & {
	/** * A true/false field */
	type: FieldType.Boolean
}
