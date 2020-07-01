import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { IFieldDefinition } from '../schema.types'

export type IBooleanFieldDefinition = IFieldDefinition<boolean> & {
	/** * A true/false field */
	type: FieldType.Boolean
}
