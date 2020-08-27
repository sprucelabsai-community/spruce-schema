import { FieldDefinition } from '#spruce/schemas/fields/fields.types'
import {
	IInvalidFieldErrorOptions,
	IInvalidFieldError,
} from './errors/error.types'
import SpruceError from './errors/SpruceError'
import FieldFactory from './factories/FieldFactory'
import AbstractField from './fields/AbstractField'
import { ISchemasById } from './fields/field.static.types'
import {
	ISchema,
	SchemaPartialValues,
	SchemaFields,
	SchemaFieldNames,
	ISchemaNormalizeOptions,
	SchemaFieldValueType,
	ISchemaValidateOptions,
	SchemaDefaultValues,
	ISchemaGetValuesOptions,
	SchemaAllValues,
	ISchemaNamedFieldsOptions,
	ISchemaNamedField,
	ISchemaGetDefaultValuesOptions,
	SchemaFieldNamesWithDefaultValue,
	ISchemaEntity,
	SchemaPublicValues,
	SchemaPublicFieldNames,
} from './schemas.static.types'

/** Universal schema class  */
export default class SchemaEntity<S extends ISchema>
	implements ISchemaEntity<S> {
	public static enableDuplicateCheckWhenTracking = true
	private static schemasById: ISchemasById = {}

	public get schemaId() {
		return this.schema.id
	}

	public get version() {
		return this.schema.version
	}

	public get description() {
		return this.schema.id
	}

	private schema: S

	/** The raw values of this schema */
	public values: SchemaPartialValues<S>

	/** All the field objects keyed by field name, use getField rather than accessing this directly */
	private fields: SchemaFields<S>

	/** For caching getNamedFields() */
	// private namedFieldCache: ISchemaNamedField<T>[] | undefined

	public constructor(schema: S, values?: SchemaPartialValues<S>) {
		this.schema = schema
		this.values = values ? values : {}

		// Pull field definitions off schema
		const fieldDefinitions = this.schema.fields
		if (!fieldDefinitions) {
			throw new Error(`Schemas don't support dynamic fields yet`)
		}

		// Empty fields to start
		this.fields = {} as SchemaFields<S>

		Object.keys(fieldDefinitions).forEach((name) => {
			const schema = fieldDefinitions[name]
			const field = FieldFactory.Field(name, schema)
			// TODO why do i have to cast to any?
			this.fields[name as SchemaFieldNames<S>] = field as any

			if (schema.value) {
				this.set(name as SchemaFieldNames<S>, schema.value)
			}
		})
	}

	public static trackSchema(schema: ISchema) {
		this.validateSchema(schema)

		const id = schema.id
		if (!this.schemasById[id]) {
			this.schemasById[id] = []
		}
		this.schemasById[id].push(schema)
	}

	public static forgetSchema(id: string) {
		delete SchemaEntity.schemasById[id]
	}

	public static forgetAllSchemas() {
		this.schemasById = {}
	}

	public static getSchema(id: string, version?: string): ISchema | undefined {
		if (!this.schemasById[id]) {
			throw new SpruceError({
				code: 'SCHEMA_NOT_FOUND',
				schemaId: id,
			})
		}

		const match = this.schemasById[id].find((d) => d.version === version)

		if (!match) {
			throw new SpruceError({
				code: 'VERSION_NOT_FOUND',
			})
		}

		return match
	}

	public static getTrackingCount() {
		return Object.keys(this.schemasById).length
	}

	public static areSchemasTheSame(left: ISchema, right: ISchema): boolean {
		if (left.id !== right.id) {
			return false
		}

		const fields1 = Object.keys(left.fields ?? {}).sort()
		const fields2 = Object.keys(right.fields ?? {}).sort()

		if (fields1.join('|') !== fields2.join('|')) {
			return false
		}

		// TODO let fields compare their definitions

		return true
	}

	/** Tells you if a schema schema is valid */
	public static isSchemaValid(definition: unknown): definition is ISchema {
		try {
			SchemaEntity.validateSchema(definition)
			return true
		} catch {
			return false
		}
	}

	/** Throws a field validation error */
	public static validateSchema(schema: any): asserts schema is ISchema {
		const errors: string[] = []

		if (!schema) {
			errors.push('definition_empty')
		} else {
			if (!schema.id) {
				errors.push('id_missing')
			} else if (!(typeof schema.id === 'string')) {
				errors.push('id_not_string')
			}

			if (!schema.name) {
				errors.push('name_missing')
			} else if (!(typeof schema.name === 'string')) {
				errors.push('name_not_string')
			}

			if (!schema.fields && !schema.dynamicKeySignature) {
				errors.push('needs_fields_or_dynamic_key_signature')
			}
		}

		if (errors.length > 0) {
			throw new SpruceError({
				code: 'INVALID_SCHEMA_DEFINITION',
				schemaId: schema?.id ?? 'ID MISSING',
				errors,
			})
		}
	}

	/** Normalize a value against a field. runs through valueType transformer and makes an array if isArray is true */
	public normalizeValue<
		F extends SchemaFieldNames<S>,
		CreateEntityInstances extends boolean = true
	>(
		forField: F,
		value: any,
		options?: ISchemaNormalizeOptions<S, CreateEntityInstances>
	): SchemaFieldValueType<S, F, CreateEntityInstances> {
		// If the value is not null or undefined, coerce it into an array
		let localValue =
			value === null || typeof value === 'undefined'
				? ([] as SchemaFieldValueType<S, F>)
				: Array.isArray(value)
				? value
				: [value]

		if (!Array.isArray(localValue)) {
			throw new SpruceError({
				code: 'INVALID_FIELD',
				schemaId: this.schema.id,
				errors: [{ name: forField, code: 'value_not_array' }],
			})
		}

		const { validate = true, createEntityInstances = true, byField } =
			options ?? {}

		// Get field && override options by that field
		const field = this.fields[forField]
		const overrideOptions = byField?.[forField] ?? {}

		if (value === null || typeof value === 'undefined') {
			if (!validate || !field.isRequired) {
				return value
			} else {
				throw new SpruceError({
					code: 'INVALID_FIELD',
					schemaId: this.schema.id,
					errors: [{ name: forField, code: 'missing_required' }],
				})
			}
		}

		// Validate if we're supposed to
		let errors: IInvalidFieldError[] = []
		if (validate) {
			localValue.forEach((value) => {
				errors = [
					...errors,
					...field.validate(value, {
						schemasById: SchemaEntity.schemasById,
						...(field.definition.options ?? {}),
						...overrideOptions,
					}),
				]
			})
		}

		// If there are any errors, bail
		if (errors.length > 0) {
			throw new SpruceError({
				code: 'INVALID_FIELD',
				schemaId: this.schema.id,
				errors,
			})
		}

		// If there is a value, transform it to it's expected value
		// Is array will always pass here
		if (localValue.length > 0) {
			localValue = localValue.map((value) =>
				typeof value === 'undefined'
					? undefined
					: (field as AbstractField<FieldDefinition>).toValueType(value, {
							schemasById: SchemaEntity.schemasById,
							createEntityInstances,
							...(field.definition.options ?? {}),
							...overrideOptions,
					  })
			)
		}

		return (field.isArray ? localValue : localValue[0]) as SchemaFieldValueType<
			S,
			F,
			CreateEntityInstances
		>
	}

	/** Get any field by name */
	public get<
		F extends SchemaFieldNames<S>,
		CreateEntityInstances extends boolean = true
	>(
		fieldName: F,
		options: ISchemaNormalizeOptions<S, CreateEntityInstances> = {}
	): SchemaFieldValueType<S, F, CreateEntityInstances> {
		// Get value off self
		const value: SchemaFieldValueType<S, F> | undefined | null =
			this.values[fieldName] !== undefined ? this.values[fieldName] : undefined

		return this.normalizeValue(fieldName, value, options)
	}

	/** Set a value and ensure its type */
	public set<F extends SchemaFieldNames<S>>(
		fieldName: F,
		value: SchemaFieldValueType<S, F>,
		options: ISchemaNormalizeOptions<S, false> = {}
	): this {
		// If the value is not null or undefined, coerce it into an array
		const localValue = this.normalizeValue(fieldName, value, options)

		this.values[fieldName] = localValue

		return this
	}

	public isValid(options: ISchemaValidateOptions<S> = {}) {
		try {
			this.validate(options)
			return true
		} catch {
			return false
		}
	}

	public validate(options: ISchemaValidateOptions<S> = {}) {
		const errors: IInvalidFieldErrorOptions['errors'] = []

		this.getNamedFields(options).forEach((item) => {
			const { name, field } = item

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
				schemaId: this.schema.id,
				errors,
			})
		}
	}

	/** Get all default values based on the definition */
	public getDefaultValues<
		F extends SchemaFieldNamesWithDefaultValue<
			S
		> = SchemaFieldNamesWithDefaultValue<S>,
		CreateEntityInstances extends boolean = true
	>(
		options: ISchemaGetDefaultValuesOptions<S, F, CreateEntityInstances> = {}
	): Pick<SchemaDefaultValues<S, CreateEntityInstances>, F> {
		const values: Partial<SchemaDefaultValues<S>> = {}

		this.getNamedFields().forEach((namedField) => {
			const { name, field } = namedField
			if (typeof field.definition.defaultValue !== 'undefined') {
				// TODO how to type name so it works as key of values
				// @ts-ignore
				values[name] = this.normalizeValue(
					name,
					field.definition.defaultValue,
					options
				)
			}
		})
		return values as Pick<SchemaDefaultValues<S, CreateEntityInstances>, F>
	}

	/** Get all values valued */
	public getValues<
		F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
		PF extends SchemaPublicFieldNames<S> = SchemaPublicFieldNames<S>,
		CreateEntityInstances extends boolean = true,
		IncludePrivateFields extends boolean = true
	>(
		options?: ISchemaGetValuesOptions<
			S,
			F,
			PF,
			CreateEntityInstances,
			IncludePrivateFields
		>
	): IncludePrivateFields extends false
		? Pick<SchemaPublicValues<S, CreateEntityInstances>, PF>
		: Pick<SchemaAllValues<S, CreateEntityInstances>, F> {
		const values: SchemaPartialValues<S, CreateEntityInstances> = {}

		const { fields = Object.keys(this.fields), includePrivateFields = true } =
			options || {}

		this.getNamedFields().forEach((namedField) => {
			const { name, field } = namedField
			if (
				fields.indexOf(name) > -1 &&
				(includePrivateFields || !field.isPrivate)
			) {
				const value = this.get(name, options)
				values[name] = value
			}
		})

		// We know this conforms after the loop above, nothing to do here
		//@ts-ignore
		return values
	}

	/** Set a bunch of values at once */
	public setValues(values: SchemaPartialValues<S>): this {
		this.getNamedFields().forEach((namedField) => {
			const { name } = namedField
			const value = values[name]
			if (typeof value !== 'undefined') {
				// TODO why cast? types should map by here
				this.set(name, value as any)
			}
		})
		return this
	}

	public getNamedFields<F extends SchemaFieldNames<S>>(
		options: ISchemaNamedFieldsOptions<S, F> = {}
	): ISchemaNamedField<S>[] {
		const namedFields: ISchemaNamedField<S>[] = []
		const { fields = Object.keys(this.fields) as F[] } = options

		fields.forEach((name) => {
			const field = this.fields[name]
			namedFields.push({ name, field })
		})

		return namedFields
	}

	public getField<F extends SchemaFieldNames<S>>(name: F) {
		const field = this.fields[name]
		return field
	}
}
