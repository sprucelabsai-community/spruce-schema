import {
	IFieldTemplateDetailOptions,
	IFieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { IIdFieldDefinition } from './IdField.types'

export default class IdField extends AbstractField<IIdFieldDefinition> {
	public static get description() {
		return "A unique identifier field, UUID's in our case."
	}
	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<IIdFieldDefinition>
	): IFieldTemplateDetails {
		return {
			valueType: `string${options.definition.isArray ? '[]' : ''}`,
		}
	}
}
