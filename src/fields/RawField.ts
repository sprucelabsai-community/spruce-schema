import { FieldType } from '#spruce:schema/fields/fieldType'
import AbstractField, { IFieldDefinition } from './AbstractField'

export type IRawFieldDefinition = IFieldDefinition<any> & {
	/** * .Raw - Deprecated, don't use */
	type: FieldType.Raw
	options: {
		interfaceName: string
	}
}

export default class RawField extends AbstractField<IRawFieldDefinition> {
	public static templateDetails() {
		return {
			valueType: 'any',
			description:
				'Deprecated. For internal purposes only (will be deleted soon)'
		}
	}
}
