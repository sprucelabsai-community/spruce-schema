import AbstractField, { IFieldDefinition } from './AbstractField'
import { FieldType } from '#spruce:schema/fields/fieldType'

export type IBooleanFieldDefinition = IFieldDefinition<boolean> & {
	/** * A true/false field */
	type: FieldType.Boolean
}

export default class BooleanField extends AbstractField<
	IBooleanFieldDefinition
> {
	public static templateDetails() {
		return {
			valueType: 'boolean',
			description:
				'A true/false. Converts false string to false, all other strings to true.'
		}
	}
	/** * Turn everything into a string */
	public toValueType(value: any): boolean {
		switch (value) {
			case 'true':
				return true
			case 'false':
				return false
		}
		return !!value
	}
}
