import { IFieldMap } from '#spruce/schemas/fields/fields.types'
import AbstractEntity from './AbstractEntity'
import { IInvalidFieldErrorOptions } from './errors/error.types'
import SpruceError from './errors/SpruceError'
import FieldFactory from './factories/FieldFactory'
import {
	FieldDefinitionValueType,
	IField,
	IFieldDefinition,
} from './fields/field.static.types'
import {
	DynamicSchemaAllValues,
	DynamicSchemaPartialValues,
	IDynamicSchemaEntity,
	IDynamicSchemaGetValuesOptions,
	IDynamicSchemaNamedFieldsOptions,
	ISchema,
	IDynamicSchemaNamedField,
	ISchemaNormalizeOptions,
	IDynamicSchemaValidateOptions,
	IDynamicSchemaNormalizeOptions,
} from './schemas.static.types'
import normalizeFieldValue from './utilities/normalizeFieldValue'

export default class DynamicSchemaEntity<
		S extends ISchema,
		Field extends IField<any> = S['dynamicFieldSignature'] extends IFieldDefinition
			? IFieldMap[S['dynamicFieldSignature']['type']]
			: any
	>
	extends AbstractEntity
	implements IDynamicSchemaEntity<S, Field> {
	private values: DynamicSchemaPartialValues<S> = {}
	private dynamicField: Field

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
		) as Field
	}

	public set<F extends string>(
		fieldName: F,
		value: FieldDefinitionValueType<Field, false>,
		options: IDynamicSchemaNormalizeOptions<false> = {}
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

	public validate(options: IDynamicSchemaValidateOptions<string> = {}): void {
		const errors: IInvalidFieldErrorOptions['errors'] = []

		this.getNamedFields(options).forEach((namedField) => {
			const { name, field } = namedField

			const value = this.get(name, {
				validate: false,
				createEntityInstances: false,
			})

			const fieldErrors = field.validate(value, {
				schemasById: {},
			})

			if (fieldErrors.length > 0) {
				errors.push(...fieldErrors)
			}
		})

		if (errors.length > 0) {
			throw new SpruceError({
				code: 'INVALID_FIELD',
				schemaId: this.schemaId,
				schemaName: this.name,
				errors,
			})
		}
	}

	public isValid(options: IDynamicSchemaValidateOptions<string> = {}): boolean {
		try {
			this.validate(options)
			return true
		} catch {
			return false
		}
	}

	public get<F extends string, CreateEntityInstances extends boolean = true>(
		fieldName: F,
		options?: ISchemaNormalizeOptions<S, CreateEntityInstances>
	): FieldDefinitionValueType<Field, CreateEntityInstances> {
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
		options?: IDynamicSchemaGetValuesOptions<S, F, CreateEntityInstances>
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
		options: IDynamicSchemaNamedFieldsOptions<F> = {}
	): IDynamicSchemaNamedField[] {
		const namedFields: IDynamicSchemaNamedField[] = []
		const { fields = Object.keys(this.values) as F[] } = options

		fields.forEach((name) => {
			namedFields.push({ name, field: this.dynamicField })
		})

		return namedFields
	}
}
