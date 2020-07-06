import { IFieldTemplateDetailOptions } from '../template.types'
import AbstractField from './AbstractField'
import { IRawFieldDefinition } from './RawField.types'

export default class RawField extends AbstractField<IRawFieldDefinition> {
	public static get description() {
		return 'Deprecated. For internal purposes only (will be deleted soon)'
	}
	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<IRawFieldDefinition>
	) {
		return {
			valueType: `(${options.definition.options.valueType})${
				options.definition.isArray ? '[]' : ''
			}`,
		}
	}
}
