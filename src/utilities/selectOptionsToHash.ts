import { ISelectFieldDefinitionChoice, ISelectFieldDefinition } from '../fields'
import {
	ISchemaDefinition,
	IFieldDefinition,
	ISchemaDefinitionFields
} from '../schema.types'
import { FieldType } from '../fields/fieldType'

/** Turn select options into a key/value pair */
export type SelectOptionsToHash<
	Options extends ISelectFieldDefinitionChoice[]
> = {
	[P in Options[number]['value']]: Extract<
		Options[number],
		{ value: P }
	>['label']
}

export type SelectFields<S extends ISchemaDefinition> = {
	[F in keyof S['fields']]: S['fields'][F] extends IFieldDefinition
		? S['fields'][F]['type'] extends FieldType.Select
			? S['fields'][F]
			: never
		: never
}

export type SelectFieldNames<S extends ISchemaDefinition> = {
	[F in keyof S['fields']]: S['fields'][F] extends IFieldDefinition
		? S['fields'][F]['type'] extends FieldType.Select
			? F
			: never
		: never
}[Extract<keyof S['fields'], string>]

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
	F extends SelectFieldNames<S>
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
