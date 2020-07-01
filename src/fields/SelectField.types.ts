import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { IFieldDefinition } from './field.static.types'

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
