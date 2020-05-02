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
export type SelectOptionsToHash<
	Options extends ISelectFieldDefinitionChoice[]
> = {
	[P in Options[number]['value']]: Extract<
		Options[number],
		{ value: P }
	>['label']
}

export function selectOptionsToHash<
	Options extends ISelectFieldDefinitionChoice[]
>(options: Options): SelectOptionsToHash<Options> {
	const partial: Partial<SelectOptionsToHash<Options>> = {}

	Object.keys(options).forEach(key => {
		// @ts-ignore
		partial[key] = options[key]
	})

	return partial as SelectOptionsToHash<Options>
}

export function definitionOptionsToHash<
	S extends ISchemaDefinition,
	F extends PickFieldNames<S, FieldType.Select>
>(
	definition: S,
	fieldName: F
): S['fields'] extends ISchemaDefinitionFields
	? S['fields'][F] extends ISelectFieldDefinition
		? S['fields'][F]['options'] extends ISelectFieldDefinition['options']
			? SelectOptionsToHash<S['fields'][F]['options']['choices']>
			: never
		: never
	: never {
	//@ts-ignore
	return selectOptionsToHash(
		//@ts-ignore
		definition.fields?.[fieldName].options.choices || []
	)
}
