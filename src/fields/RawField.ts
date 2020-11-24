import {
	FieldTemplateDetailOptions,
	FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { RawFieldDefinition } from './RawField.types'

export default class RawField extends AbstractField<RawFieldDefinition> {
	public static get description() {
		return 'Set an interface directly.'
	}
	public static generateTemplateDetails(
		options: FieldTemplateDetailOptions<RawFieldDefinition>
	): FieldTemplateDetails {
		return {
			valueType: `(${options.definition.options.valueType})${
				options.definition.isArray ? '[]' : ''
			}`,
		}
	}
}
