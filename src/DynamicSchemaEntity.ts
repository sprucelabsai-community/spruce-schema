import { IFieldMap } from '#spruce/schemas/fields/fields.types'
import { IInvalidFieldErrorOptions } from './errors/error.types'
import SpruceError from './errors/SpruceError'
import FieldFactory from './factories/FieldFactory'
import {
	FieldDefinitionValueType,
	IField,
	IFieldDefinition,
} from './fields/field.static.types'
import SchemaEntity from './SchemaEntity'
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
	Schema extends ISchema,
	Field extends IField<
		any
	> = Schema['dynamicFieldSignature'] extends IFieldDefinition
		? IFieldMap[Schema['dynamicFieldSignature']['type']]
		: any
> implements IDynamicSchemaEntity<Schema, Field> {
	public get schemaId() {
		return this.schema.id
	}

	public get name() {
		return this.schema.name
	}

	public get namespace() {
		return this.schema.name
	}

	public get version() {
		return this.schema.version
	}

	public get description() {
		return this.schema.id
	}

	private schema: Schema
	private values: DynamicSchemaPartialValues<Schema> = {}
	private dynamicField: Field

	public constructor(
		schema: Schema,
		values?: DynamicSchemaPartialValues<Schema>
	) {
		if (!schema.dynamicFieldSignature) {
			throw new Error(
				`DynamicSchemaEntity only works with with schemas with dynamicFieldSignature set.`
			)
		}

		this.schema = schema
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
			SchemaEntity.schemasById,
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
				schemasById: SchemaEntity.schemasById,
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
		options?: ISchemaNormalizeOptions<Schema, CreateEntityInstances>
	): FieldDefinitionValueType<Field, CreateEntityInstances> {
		const value = this.values[fieldName]
		return normalizeFieldValue(
			this.schemaId,
			this.name,
			SchemaEntity.schemasById,
			this.dynamicField,
			value,
			options || {}
		)
	}

	public getValues<
		F extends string,
		CreateEntityInstances extends boolean = true
	>(
		options?: IDynamicSchemaGetValuesOptions<Schema, F, CreateEntityInstances>
	): DynamicSchemaAllValues<Schema, CreateEntityInstances> {
		const values: DynamicSchemaPartialValues<Schema> = {}

		this.getNamedFields().forEach((namedField) => {
			const { name } = namedField
			const value = this.get(name, options)
			//@ts-ignore
			values[name] = value
		})

		return values as DynamicSchemaAllValues<Schema, CreateEntityInstances>
	}

	public setValues(values: DynamicSchemaPartialValues<Schema>): this {
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
