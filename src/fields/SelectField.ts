import { FieldType } from '#spruce:schema/fields/fieldType'
import AbstractField, { IFieldDefinition } from './AbstractField'

export interface ISelectFieldDefinitionChoice {
	/**  Machine readable way to identify this choice */
	value: string
	/** Human readable label for when selecting a choice */
	label: string
}

export type ISelectFieldDefinition = IFieldDefinition<string> & {
	/** * .Select - A way to chose between a choices */
	type: FieldType.Select
	options: {
		choices: ISelectFieldDefinitionChoice[]
	}
}

export default class SelectField<
	T extends ISelectFieldDefinition = ISelectFieldDefinition
> extends AbstractField<T> {
	public constructor(definition: T) {
		super(definition)
		if (!definition.options || !definition.options.choices) {
			throw new Error('Select field is missing choices.')
		}
	}
	public static templateDetails() {
		return {
			valueType: 'string',
			description:
				'Stored as string, lets user select between available options.'
		}
	}

	public getChoices(): ISelectFieldDefinitionChoice[] {
		return this.definition.options.choices
	}
}
