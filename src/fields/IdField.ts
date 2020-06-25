import { IFieldDefinition } from '../schema.types'
import { IFieldTemplateDetailOptions } from '../template.types'
import AbstractField from './AbstractField'
import FieldType from '#spruce:schema/fields/fieldType'

export type IIdFieldDefinition = IFieldDefinition<string> & {
	/** * .Id a field to hold a unique id (UUID4 in Spruce) */
	type: FieldType.Id
	options?: {}
}

export default class IdField extends AbstractField<IIdFieldDefinition> {
	public static get description() {
		return "A unique identifier field, UUID's in our case."
	}
	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<IIdFieldDefinition>
	) {
		return {
			valueType: `string${options.definition.isArray ? '[]' : ''}`
		}
	}
}
