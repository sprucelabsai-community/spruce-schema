import { IFieldDefinition } from './field.static.types'

export interface ISelectFieldDefinitionChoice {
	/**  Machine readable way to identify this choice */
	value: string
	/** Human readable label for when selecting a choice */
	label: string
}

export interface ISelectFieldOptions {
	choices: ISelectFieldDefinitionChoice[]
}

export type SelectFieldValueTypeMapper<
	F extends ISelectFieldDefinition
> = F['options']['choices'][number]['value']

export type ISelectFieldDefinition = IFieldDefinition<
	string,
	string,
	string[],
	string[]
> & {
	/** * .Select - A way to chose between a choices */
	type: 'select'
	options: ISelectFieldOptions
}
