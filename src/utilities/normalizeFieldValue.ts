import {
	Fields,
	FieldDefinitions,
	FieldDefinitionMap,
} from '#spruce/schemas/fields/fields.types'
import { InvalidFieldError } from '../errors/error.types'
import SpruceError from '../errors/SpruceError'
import { FieldDefinitionValueType, IField } from '../fields'
import { SchemasById } from '../fields/field.static.types'
import { SchemaNormalizeFieldValueOptions } from '../schemas.static.types'

export default function normalizeFieldValue<
	F extends Fields,
	CreateEntityInstances extends boolean
>(
	schemaId: string,
	schemaName: string | undefined,
	schemasById: SchemasById,
	field: F,
	value: any,
	options: SchemaNormalizeFieldValueOptions<CreateEntityInstances> &
		Partial<FieldDefinitionMap[F['type']]['options']>
) {
	let localValue = normalizeValueToArray<F, CreateEntityInstances>(value)

	if (!Array.isArray(localValue)) {
		throw new SpruceError({
			code: 'INVALID_FIELD',
			schemaId,
			errors: [
				{
					name: field.name,
					code: 'invalid_value',
					friendlyMessage: `I was expecting an array for ${field.name}.`,
				},
			],
		})
	}

	const {
		validate = true,
		createEntityInstances = true,
		...extraOptions
	} = options ?? {}

	const baseOptions = {
		schemasById,
		...(field.definition.options ?? {}),
		...extraOptions,
	}

	if (value === null || typeof value === 'undefined') {
		if (field && (!validate || !field.isRequired)) {
			return value
		} else {
			throw new SpruceError({
				code: 'INVALID_FIELD',
				schemaId,
				schemaName,
				errors: [
					{
						name: field.name,
						code: !field ? 'unexpected_value' : 'missing_required',
					},
				],
			})
		}
	}

	let errors: InvalidFieldError[] = []
	if (validate) {
		localValue.forEach((value) => {
			errors = [
				...errors,
				...field.validate(value, {
					...baseOptions,
				}),
			]
		})
	}

	if (errors.length > 0) {
		throw new SpruceError({
			code: 'INVALID_FIELD',
			schemaId,
			errors,
		})
	}

	if (localValue.length > 0) {
		localValue = localValue.map((value) =>
			typeof value === 'undefined'
				? undefined
				: (field as IField<FieldDefinitions>).toValueType(value, {
						createEntityInstances,
						...baseOptions,
				  })
		)
	}

	return (
		field.isArray ? localValue : localValue[0]
	) as FieldDefinitionValueType<F, CreateEntityInstances>
}

export function normalizeValueToArray<
	F extends Fields,
	CreateEntityInstances extends boolean
>(value: any) {
	return value === null || typeof value === 'undefined'
		? ([] as FieldDefinitionValueType<F, CreateEntityInstances>)
		: Array.isArray(value)
		? value
		: [value]
}
