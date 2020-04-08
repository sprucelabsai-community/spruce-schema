import { FieldType } from './types'
import TextField from './TextField'
import { IFieldDefinition } from './AbstractField'

export interface ISelectFieldDefinitionChoice {
	/**  Machine readable way to identify this choice */
	value: string
	/** Human readable label for when selecting a choice */
	label: string
}

export interface ISelectFieldDefinition extends IFieldDefinition {
	/** * .Select - a select field with many choices */
	type: FieldType.Select
	value?: string
	defaultValue?: string
	options: {
		choices: ISelectFieldDefinitionChoice[]
	}
}

export default class SelectField extends TextField<ISelectFieldDefinition> {
	public constructor(definition: ISelectFieldDefinition) {
		super(definition)
		if (!definition.options || !definition.options.choices) {
			throw new Error('Select field is missing choices.')
		}
	}
	public static templateDetails() {
		return {
			valueType: 'string'
		}
	}

	public getChoices(): ISelectFieldDefinitionChoice[] {
		return this.definition.options.choices
	}
}
