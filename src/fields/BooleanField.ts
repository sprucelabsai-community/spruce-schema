import { IFieldTemplateDetailOptions } from '../template.types'
import AbstractField from './AbstractField'
import { IBooleanFieldDefinition } from './BooleanField.types'

export default class BooleanField extends AbstractField<
	IBooleanFieldDefinition
> {
	public static get description() {
		return 'A true/false. Converts false string to false, all other strings to true.'
	}

	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<IBooleanFieldDefinition>
	) {
		return {
			valueType: `boolean${options.definition.isArray ? '[]' : ''}`
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
