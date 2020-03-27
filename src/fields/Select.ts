import { FieldType } from './types'
import FieldText from './Text'
import { IFieldBaseDefinition } from './Base'

export interface IFieldSelectDefinitionChoice {
	/**  machine readable way to identify this choice */
	value: string
	/** human readable label for when selecting a choice */
	label: string
}

export interface IFieldSelectDefinition extends IFieldBaseDefinition {
	type: FieldType.Select
	value?: string
	defaultValue?: string
	options: {
		choices: IFieldSelectDefinitionChoice[]
	}
}

export default class FieldSelect extends FieldText<IFieldSelectDefinition> {
	public constructor(definition: IFieldSelectDefinition) {
		super(definition)
		if (!definition.options || !definition.options.choices) {
			throw new Error('Select field is missing choices.')
		}
	}
	public static templateDetails() {
		return {
			definitionInterface: 'IFieldSelectDefinition',
			valueType: 'string'
		}
	}

	public getChoices(): IFieldSelectDefinitionChoice[] {
		return this.definition.options.choices
	}
}
