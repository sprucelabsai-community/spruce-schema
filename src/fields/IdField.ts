import {
	FieldTemplateDetailOptions,
	FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { IIdFieldDefinition } from './IdField.types'

export default class IdField extends AbstractField<IIdFieldDefinition> {
	public static get description() {
		return 'A unique identifier field.'
	}

	public static generateTemplateDetails(
		options: FieldTemplateDetailOptions<IIdFieldDefinition>
	): FieldTemplateDetails {
		return {
			valueType: `string${options.definition.isArray ? '[]' : ''}`,
		}
	}

	public toValueType(value: any) {
		return `${value}`
	}
}
