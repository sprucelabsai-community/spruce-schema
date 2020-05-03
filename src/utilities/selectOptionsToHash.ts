import {
	ISelectFieldDefinitionChoice,
	ISelectFieldDefinition
} from '../fields/SelectField'
import {
	ISchemaDefinition,
	ISchemaDefinitionFields,
	PickFieldNames
} from '../schema.types'
import { FieldType } from '#spruce:schema/fields/fieldType'

/** Turn select options into a key/value pair */
export type SelectChoicesToHash<
	Options extends ISelectFieldDefinitionChoice[]
> = {
	[P in Options[number]['value']]: Extract<
		Options[number],
		{ value: P }
	>['label']
}

export function selectChoicesToHash<
	Options extends ISelectFieldDefinitionChoice[]
>(options: Options): SelectChoicesToHash<Options> {
	const partial: Partial<SelectChoicesToHash<Options>> = {}

	Object.keys(options).forEach(key => {
		// @ts-ignore
		partial[key] = options[key]
	})

	return partial as SelectChoicesToHash<Options>
}

export function definitionChoicesToHash<
	S extends ISchemaDefinition,
	F extends PickFieldNames<S, FieldType.Select>
>(
	definition: S,
	fieldName: F
): S['fields'] extends ISchemaDefinitionFields
	? S['fields'][F] extends ISelectFieldDefinition
		? S['fields'][F]['options'] extends ISelectFieldDefinition['options']
			? SelectChoicesToHash<S['fields'][F]['options']['choices']>
			: never
		: never
	: never {
	//@ts-ignore
	return selectChoicesToHash(
		//@ts-ignore
		definition.fields?.[fieldName].options.choices || []
	)
}
