import SchemaError from './errors/SchemaError'
import {
	ErrorCode,
	IInvalidFieldErrorOptions,
	IInvalidFieldError
} from './errors/error.types'
import FieldFactory from './factories/FieldFactory'
import {
	ISchemaDefinition,
	SchemaDefinitionPartialValues,
	SchemaFields,
	SchemaFieldNames,
	ISchemaNormalizeOptions,
	SchemaFieldDefinitionValueType,
	ISchemaValidateOptions,
	SchemaDefinitionDefaultValues,
	ISchemaGetValuesOptions,
	SchemaDefinitionAllValues,
	ISchemaNamedFieldsOptions,
	ISchemaNamedField,
	ISchemaGetDefaultValuesOptions,
	FieldNamesWithDefaultValueSet,
	ISchema,
	IField
} from './schema.types'
import { ISchemaFieldDefinition } from './fields'

/** Universal schema class  */
export default class Schema<S extends ISchemaDefinition> implements ISchema<S> {
	/** Should i do a duplicate check on schemas when tracking globally? */
	public static enableDuplicateCheckWhenTracking = true

	/** Global definition hash for lookups by id */
	private static definitionsById: { [key: string]: ISchemaDefinition } = {}

	/** Our unique id */
	public get schemaId() {
		return this.definition.id
	}

	/** The schema definition */
	public definition: S

	/** The values of this schema */
	public values: SchemaDefinitionPartialValues<S>

	/** All the field objects keyed by field name, use getField rather than accessing this directly */
	public fields: SchemaFields<S>

	/** For caching getNamedFields() */
	// private namedFieldCache: ISchemaNamedField<T>[] | undefined

	public constructor(definition: S, values?: SchemaDefinitionPartialValues<S>) {
		this.definition = definition
		this.values = values ? values : {}

		// Pull field definitions off schema definition
		const fieldDefinitions = this.definition.fields
		if (!fieldDefinitions) {
			throw new Error(`Schemas don't support dynamic fields yet`)
		}

		// Empty fields to start
		this.fields = {} as SchemaFields<S>

		Object.keys(fieldDefinitions).forEach(name => {
			const definition = fieldDefinitions[name]
			const field = FieldFactory.field(name, definition)
			// TODO why do i have to cast to any?
			this.fields[name as SchemaFieldNames<S>] = field as any

			if (definition.value) {
				this.set(name as SchemaFieldNames<S>, definition.value)
			}
		})
	}

	/** Track a definition for lookup later */
	public static trackDefinition(definition: ISchemaDefinition) {
		Schema.validateDefinition(definition)
		const existing = Schema.definitionsById[definition.id]
		if (existing && Schema.enableDuplicateCheckWhenTracking) {
			throw new SchemaError({
				code: ErrorCode.DuplicateSchema,
				schemaId: definition.id
			})
		}
		Schema.definitionsById[definition.id] = definition
	}

	/** Forget the definition. You can no longer look it up by id */
	public static forgetDefinition(id: string) {
		delete Schema.definitionsById[id]
	}

	/** Get a tracked definition by id */
	public static getDefinition(id: string): ISchemaDefinition | undefined {
		return this.definitionsById[id]
	}

	/** Compares 2 definitions and tells you if they are the same */
	public static areDefinitionsTheSame(
		left: ISchemaDefinition,
		right: ISchemaDefinition
	): boolean {
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

	/** Tells you if a schema definition is valid */
	public static isDefinitionValid(
		definition: unknown
	): definition is ISchemaFieldDefinition {
		try {
			Schema.validateDefinition(definition)
			return true
		} catch {
			return false
		}
	}

	/** Throws a field validation error */
	public static validateDefinition(
		definition: any
	): asserts definition is ISchemaDefinition {
		const errors: string[] = []

		if (!definition) {
			errors.push('definition_empty')
		} else {
			if (!definition.id) {
				errors.push('id_missing')
			} else if (!(typeof definition.id === 'string')) {
				errors.push('id_not_string')
			}

			if (!definition.name) {
				errors.push('name_missing')
			} else if (!(typeof definition.name === 'string')) {
				errors.push('name_not_string')
			}

			if (!definition.fields && !definition.dynamicKeySignature) {
				errors.push('needs_fields_or_dynamic_key_signature')
			}
		}

		if (errors.length > 0) {
			throw new SchemaError({
				code: ErrorCode.InvalidSchemaDefinition,
				schemaId: definition?.id ?? 'ID MISSING',
				errors
			})
		}
	}

	/** Normalize a value against a field. runs through valueType transformer and makes an array if isArray is true */
	public normalizeValue<
		F extends SchemaFieldNames<S>,
		CreateSchemaInstances extends boolean = true
	>(
		forField: F,
		value: any,
		options?: ISchemaNormalizeOptions<S, CreateSchemaInstances>
	): SchemaFieldDefinitionValueType<S, F, CreateSchemaInstances> {
		// If the value is not null or undefined, coerce it into an array
		let localValue =
			value === null || typeof value === 'undefined'
				? ([] as SchemaFieldDefinitionValueType<S, F>)
				: Array.isArray(value)
				? value
				: [value]

		if (!Array.isArray(localValue)) {
			throw new SchemaError({
				code: ErrorCode.InvalidField,
				schemaId: this.definition.id,
				errors: [{ name: forField, code: 'value_not_array' }]
			})
		}

		const { validate = true, createSchemaInstances = true, byField } =
			options ?? {}

		// Get field && override options by that field
		const field = this.fields[forField]
		const overrideOptions = byField?.[forField] ?? {}

		// Validate if we're supposed to
		let errors: IInvalidFieldError[] = []
		if (validate) {
			localValue.forEach(value => {
				errors = [
					...errors,
					...field.validate(value, {
						definitionsById: Schema.definitionsById,
						...(field.definition.options ?? {}),
						...overrideOptions
					})
				]
			})
		}

		// If there are any errors, bail
		if (errors.length > 0) {
			throw new SchemaError({
				code: ErrorCode.InvalidField,
				schemaId: this.definition.id,
				errors
			})
		}

		// If there is a value, transform it to it's expected value
		// Is array will always pass here
		if (localValue.length > 0) {
			localValue = localValue.map(value =>
				typeof value === 'undefined'
					? undefined
					: (field as IField<any>).toValueType(value, {
							definitionsById: Schema.definitionsById,
							createSchemaInstances,
							...(field.definition.options ?? {}),
							...overrideOptions
					  })
			)
		}

		return (field.isArray
			? localValue
			: localValue[0]) as SchemaFieldDefinitionValueType<
			S,
			F,
			CreateSchemaInstances
		>
	}

	/** Get any field by name */
	public get<
		F extends SchemaFieldNames<S>,
		CreateSchemaInstances extends boolean = true
	>(
		fieldName: F,
		options: ISchemaNormalizeOptions<S, CreateSchemaInstances> = {}
	): SchemaFieldDefinitionValueType<S, F, CreateSchemaInstances> {
		// Get value off self
		const value: SchemaFieldDefinitionValueType<S, F> | undefined | null =
			this.values[fieldName] !== undefined ? this.values[fieldName] : undefined

		return this.normalizeValue(fieldName, value, options)
	}

	/** Set a value and ensure its type */
	public set<F extends SchemaFieldNames<S>>(
		fieldName: F,
		value: SchemaFieldDefinitionValueType<S, F>,
		options: ISchemaNormalizeOptions<S, false> = {}
	): this {
		// If the value is not null or undefined, coerce it into an array
		const localValue = this.normalizeValue(fieldName, value, options)

		this.values[fieldName] = localValue

		return this
	}

	/** Is this schema valid? */
	public isValid() {
		try {
			this.validate()
			return true
		} catch {
			return false
		}
	}

	/** Returns an array of schema validation errors */
	public validate(options: ISchemaValidateOptions<S> = {}) {
		const errors: IInvalidFieldErrorOptions['errors'] = []

		this.getNamedFields(options).forEach(item => {
			const { name, field } = item
			const value = this.get(name, { validate: false })
			const fieldErrors = field.validate(value, {
				definitionsById: Schema.definitionsById
			})

			if (fieldErrors.length > 0) {
				errors.push(...fieldErrors)
			}
		})

		if (errors.length > 0) {
			throw new SchemaError({
				code: ErrorCode.InvalidField,
				schemaId: this.definition.id,
				errors
			})
		}
	}

	/** Get all default values based on the definition */
	public getDefaultValues<
		F extends FieldNamesWithDefaultValueSet<S> = FieldNamesWithDefaultValueSet<
			S
		>,
		CreateSchemaInstances extends boolean = true
	>(
		options: ISchemaGetDefaultValuesOptions<S, F, CreateSchemaInstances> = {}
	): Pick<SchemaDefinitionDefaultValues<S, CreateSchemaInstances>, F> {
		const values: Partial<SchemaDefinitionDefaultValues<S>> = {}

		this.getNamedFields().forEach(namedField => {
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
		return values as Pick<
			SchemaDefinitionDefaultValues<S, CreateSchemaInstances>,
			F
		>
	}

	/** Get all values valued */
	public getValues<
		F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
		CreateSchemaInstances extends boolean = true
	>(
		options: ISchemaGetValuesOptions<S, F, CreateSchemaInstances> = {}
	): Pick<SchemaDefinitionAllValues<S, CreateSchemaInstances>, F> {
		const values: SchemaDefinitionPartialValues<S, CreateSchemaInstances> = {}

		const { fields = Object.keys(this.fields) } = options

		this.getNamedFields().forEach(namedField => {
			const { name } = namedField
			if (fields.indexOf(name) > -1) {
				const value = this.get(name, options)
				values[name] = value
			}
		})

		// We know this conforms after the loop above, nothing to do here
		return values as Pick<
			SchemaDefinitionAllValues<S, CreateSchemaInstances>,
			F
		>
	}

	/** Set a bunch of values at once */
	public setValues(values: SchemaDefinitionPartialValues<S>): this {
		this.getNamedFields().forEach(namedField => {
			const { name } = namedField
			const value = values[name]
			if (typeof value !== 'undefined') {
				// TODO why cast? types should map by here
				this.set(name, value as any)
			}
		})
		return this
	}

	/** Get all fields as an array for easy looping and mapping */
	public getNamedFields<F extends SchemaFieldNames<S>>(
		options: ISchemaNamedFieldsOptions<S, F> = {}
	): ISchemaNamedField<S>[] {
		// If (this.namedFieldCache) {
		// 	return this.namedFieldCache
		// }
		const namedFields: ISchemaNamedField<S>[] = []
		const { fields = Object.keys(this.fields) as F[] } = options

		fields.forEach(name => {
			const field = this.fields[name]
			namedFields.push({ name, field })
		})

		return namedFields
	}
}
