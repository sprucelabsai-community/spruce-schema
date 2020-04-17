import { FieldType } from '#spruce:schema/fields/fieldType'
import AbstractField, { IFieldDefinition } from './AbstractField'

type Narrowable =
	| string
	| number
	| boolean
	| symbol
	| object
	| null
	| undefined
	| void
	| ((...args: any[]) => any)
	| {}

//TODO figure out how to stop widening in the schema so types are saved
/** Build select options so they can generate a union based on values */
export function buildSelectChoices<
	T extends { [k: string]: V | T } | Array<{ [k: string]: V | T }>,
	V extends Narrowable
>(t: T): T {
	return t
}

export interface ISelectFieldDefinitionChoice {
	/**  Machine readable way to identify this choice */
	value: Narrowable
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
