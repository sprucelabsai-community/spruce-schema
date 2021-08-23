import { FieldMap } from '#spruce/schemas/fields/fields.types'
import AbstractEntity from './AbstractEntity'
import { InvalidFieldErrorOptions } from './errors/error.options'
import SpruceError from './errors/SpruceError'
import FieldFactory from './factories/FieldFactory'
import {
	FieldDefinitionValueType,
	Field,
	FieldDefinition,
} from './fields/field.static.types'
import {
	DynamicSchemaAllValues,
	DynamicSchemaPartialValues,
	DynamicSchemaEntityByName,
	DynamicSchemaGetValuesOptions,
	DynamicSchemaNamedFieldsOptions,
	Schema,
	DynamicSchemaNamedField,
	SchemaNormalizeOptions,
	DynamicSchemaValidateOptions,
	DynamicSchemaNormalizeOptions,
} from './schemas.static.types'
import mapFieldErrorsToParameterErrors from './utilities/mapFieldErrorsToParameterErrors'
import normalizeFieldValue from './utilities/normalizeFieldValue'

export default class DynamicSchemaEntityImplementation<
		S extends Schema,
		OurField extends Field<any> = S['dynamicFieldSignature'] extends FieldDefinition
			? FieldMap[S['dynamicFieldSignature']['type']]
			: any
	>
	extends AbstractEntity
	implements DynamicSchemaEntityByName<S, OurField>
{
	private values: DynamicSchemaPartialValues<S> = {}
	private dynamicField: OurField

	public constructor(schema: S, values?: DynamicSchemaPartialValues<S>) {
		super(schema)

		if (!schema.dynamicFieldSignature) {
			throw new Error(
				`DynamicSchemaEntity only works with with schemas with dynamicFieldSignature set.`
			)
		}

		this.values = values || {}
		this.dynamicField = FieldFactory.Field(
			'dynamicField',
			schema.dynamicFieldSignature
		) as OurField
	}

	public set<F extends string>(
		fieldName: F,
		value: FieldDefinitionValueType<OurField, false>,
		options: DynamicSchemaNormalizeOptions<false> = {}
	): this {
		const localValue = normalizeFieldValue(
			this.schemaId,
			this.name,
			{},
			this.dynamicField,
			value,
			options
		)

		this.values[fieldName] = localValue

		return this
	}

	public validate(options: DynamicSchemaValidateOptions<string> = {}): void {
		const errors: InvalidFieldErrorOptions['errors'] = []
		const originalName = this.dynamicField.name

		this.getNamedFields(options).forEach((namedField) => {
			const { name, field } = namedField

			const value = this.values[name]

			field.name = name

			const fieldErrors = field.validate(value, {
				schemasById: {},
			})

			if (fieldErrors.length > 0) {
				errors.push(...fieldErrors)
			}
		})

		this.dynamicField.name = originalName

		if (errors.length > 0) {
			throw new SpruceError({
				code: 'VALIDATION_FAILED',
				schemaId: this.schemaId,
				schemaName: this.name,
				errors: mapFieldErrorsToParameterErrors(errors),
			})
		}
	}

	public isValid(options: DynamicSchemaValidateOptions<string> = {}): boolean {
		try {
			this.validate(options)
			return true
		} catch {
			return false
		}
	}

	public get<F extends string, CreateEntityInstances extends boolean = true>(
		fieldName: F,
		options?: SchemaNormalizeOptions<S, CreateEntityInstances>
	): FieldDefinitionValueType<OurField, CreateEntityInstances> {
		const value = this.values[fieldName]

		return normalizeFieldValue(
			this.schemaId,
			this.name,
			{},
			this.dynamicField,
			value,
			options || {}
		)
	}

	public getValues<
		F extends string,
		CreateEntityInstances extends boolean = true
	>(
		options?: DynamicSchemaGetValuesOptions<S, F, CreateEntityInstances>
	): DynamicSchemaAllValues<S, CreateEntityInstances> {
		const values: DynamicSchemaPartialValues<S> = {}

		this.getNamedFields().forEach((namedField) => {
			const { name } = namedField
			const value = this.get(name, options)
			//@ts-ignore
			values[name] = value
		})

		return values as DynamicSchemaAllValues<S, CreateEntityInstances>
	}

	public setValues(values: DynamicSchemaPartialValues<S>): this {
		this.values = { ...this.values, ...values }
		return this
	}

	public getNamedFields<F extends string>(
		options: DynamicSchemaNamedFieldsOptions<F> = {}
	): DynamicSchemaNamedField[] {
		const namedFields: DynamicSchemaNamedField[] = []
		const { fields = Object.keys(this.values) as F[] } = options

		fields.forEach((name) => {
			namedFields.push({ name, field: this.dynamicField })
		})

		return namedFields
	}
}
