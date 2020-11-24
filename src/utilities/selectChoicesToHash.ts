import {
	ISelectFieldDefinition,
	ISelectFieldDefinitionChoice,
} from '../fields/SelectField.types'
import {
	ISchema,
	SchemaFieldsByName,
	PickFieldNames,
} from '../schemas.static.types'

/** Turn select options into a key/value pair */
export type SelectChoicesToHash<
	Options extends ISelectFieldDefinitionChoice[]
> = {
	[P in Options[number]['value']]: Extract<
		Options[number],
		{ label: P }
	>['label']
}

/** Pass the select options directly to create a value/label hash */
export function selectChoicesToHash<
	Options extends ISelectFieldDefinitionChoice[]
>(options: Options): SelectChoicesToHash<Options> {
	const partial: Partial<SelectChoicesToHash<Options>> = {}

	options.forEach((option) => {
		//@ts-ignore
		partial[option.value] = option.label
	})

	return partial as SelectChoicesToHash<Options>
}

/** Take a definition and a field name and returns a value/label hash */
export function schemaChoicesToHash<
	S extends ISchema,
	F extends PickFieldNames<S, 'select'>
>(
	definition: S,
	fieldName: F
): S['fields'] extends SchemaFieldsByName
	? S['fields'][F] extends ISelectFieldDefinition
		? S['fields'][F]['options'] extends ISelectFieldDefinition['options']
			? SelectChoicesToHash<S['fields'][F]['options']['choices']>
			: never
		: never
	: never {
	// @ts-ignore
	return selectChoicesToHash(
		// @ts-ignore
		definition.fields?.[fieldName]?.options?.choices ?? []
	)
}
