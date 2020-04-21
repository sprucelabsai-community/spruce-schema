import { FieldType } from '#spruce:schema/fields/fieldType'
import AbstractField, { IFieldDefinition } from './AbstractField'
import { IFieldTemplateDetailOptions } from '../template.types'

export type IRawFieldDefinition = IFieldDefinition<any> & {
	/** * .Raw - Deprecated, don't use */
	type: FieldType.Raw
	options: {
		interfaceName: string
	}
}

export default class RawField extends AbstractField<IRawFieldDefinition> {
	public static get description() {
		return 'Deprecated. For internal purposes only (will be deleted soon)'
	}
	public static templateDetails(
		options: IFieldTemplateDetailOptions<IRawFieldDefinition>
	) {
		return {
			valueType: `any${options.definition.isArray ? '[]' : ''}`
		}
	}
}
