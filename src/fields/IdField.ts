import { FieldType } from '#spruce:schema/fields/fieldType'
import AbstractField, { IFieldDefinition } from './AbstractField'
import { IFieldTemplateDetailOptions } from '../template.types'

export type IIdFieldDefinition = IFieldDefinition<string> & {
	/** * .Id a field to hold a unique id (UUID4 in Spruce) */
	type: FieldType.Id
	options?: {}
}

export default class IdField extends AbstractField<IIdFieldDefinition> {
	public static get description() {
		return "A unique identifier field, UUID's in our case."
	}
	public static templateDetails(
		options: IFieldTemplateDetailOptions<IIdFieldDefinition>
	) {
		return {
			valueType: `string${options.definition.isArray ? '[]' : ''}`
		}
	}
}
