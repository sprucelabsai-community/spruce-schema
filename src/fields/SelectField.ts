import { FieldType } from '#spruce:schema/fields/fieldType'
import AbstractField from './AbstractField'
import { IFieldDefinition } from '../schema.types'
import { IFieldTemplateDetailOptions } from '../template.types'

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

export type SelectOptionsToHash<
	Options extends ISelectFieldDefinitionChoice[],
	Value = string
> = Record<Options[number]['value'], Value>

export function selectOptionsToHash<
	Options extends ISelectFieldDefinitionChoice[] = ISelectFieldDefinitionChoice[]
>(options: Options): SelectOptionsToHash<Options, string> {
	const partial: Partial<SelectOptionsToHash<Options, string>> = {}

	Object.keys(options).forEach(key => {
		// @ts-ignore
		partial[key] = options[key]
	})

	return partial as SelectOptionsToHash<Options, string>
}

export default class SelectField<
	T extends ISelectFieldDefinition = ISelectFieldDefinition
> extends AbstractField<T> {
	public static get description() {
		return 'Stored as string, lets user select between available options.'
	}

	public constructor(name: string, definition: T) {
		super(name, definition)
		if (!definition.options || !definition.options.choices) {
			throw new Error('Select field is missing choices.')
		}
	}

	public static templateDetails(
		options: IFieldTemplateDetailOptions<ISelectFieldDefinition>
	) {
		// Build union of select options
		const { definition } = options
		const {
			options: { choices }
		} = definition

		return {
			valueType: `(${choices.map(choice => `"${choice.value}"`).join(' | ')})`
		}
	}

	public getChoices(): ISelectFieldDefinitionChoice[] {
		return this.definition.options.choices
	}
}
