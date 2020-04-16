import { FieldType } from '#spruce:schema/fields/fieldType'
import AbstractField, { IFieldDefinition } from './AbstractField'

export type IIdFieldDefinition = IFieldDefinition<string> & {
	/** * .Id a field to hold a unique id (UUID4 in Spruce) */
	type: FieldType.Id
	options?: {}
}

export default class IdField extends AbstractField<IIdFieldDefinition> {
	public static templateDetails() {
		return {
			valueType: 'string',
			description: "A unique identifier field, UUID's in our case."
		}
	}
}
