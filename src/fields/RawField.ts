import {
	IFieldTemplateDetailOptions,
	IFieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { IRawFieldDefinition } from './RawField.types'

export default class RawField extends AbstractField<IRawFieldDefinition> {
	public static get description() {
		return 'Set an interface directly.'
	}
	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<IRawFieldDefinition>
	): IFieldTemplateDetails {
		return {
			valueType: `(${options.definition.options.valueType})${
				options.definition.isArray ? '[]' : ''
			}`,
		}
	}
}
