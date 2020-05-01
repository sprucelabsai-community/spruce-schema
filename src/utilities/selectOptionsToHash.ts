import { ISelectFieldDefinitionChoice } from '../fields'
import { ISchemaDefinition, IFieldDefinition } from '../schema.types'
import { FieldType } from '../fields/fieldType'

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
}

export function definitionOptionsToHash<
	S extends ISchemaDefinition,
	F extends SelectFieldNames<S>
>(definition: S, fieldName: F): boolean {
	console.log(definition, fieldName)
	return true
}

export function selectOptionsToHash<
	Options extends ISelectFieldDefinitionChoice[] = ISelectFieldDefinitionChoice[]
>(options: Options): SelectOptionsToHash<Options> {
	const partial: Partial<SelectOptionsToHash<Options>> = {}

	Object.keys(options).forEach(key => {
		// @ts-ignore
		partial[key] = options[key]
	})

	return partial as SelectOptionsToHash<Options>
}
