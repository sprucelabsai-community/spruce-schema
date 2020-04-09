import {
	FieldType,
	FieldDefinition,
	FieldDefinitionMap,
	FieldClassMap,
	Field,
	AbstractField,
	ISchemaFieldDefinition
} from './fields'
import SchemaError from './errors/SchemaError'
import {
	SchemaErrorCode,
	ISchemaErrorOptionsInvalidField
} from './errors/types'

/** The structure of schema.fields. key is field name, value is field definition */
export interface ISchemaDefinitionFields {
	[fieldName: string]: FieldDefinition
}

// TODO make this actually pull the field types from the class map and fix all corresponding lint errors
/** the form of schema.fields based on an actual definition  */
export type SchemaFields<T extends ISchemaDefinition> = Record<
	SchemaFieldNames<T>,
	Field
>
/** A schema defines the data structure of something */
export interface ISchemaDefinition {
	/** Give this schema a machine friendly id */
	id: string
	/** The name of this schema a human will see */
	name: string
	/** A brief human readable explanation of this schema */
	description?: string
	/** How we type dynamic keys on this schema, if defined you cannot define fields */
	dynamicKeySignature?: FieldDefinition & { key: string }
	/** All the fields, keyed by name, required if no dynamicKeySignature is set */
	fields?: ISchemaDefinitionFields
}

/** To map a schema to an object with values whose types match */
export type SchemaDefinitionAllValues<T extends ISchemaDefinition> = {
	[K in SchemaFieldNames<T>]: SchemaFieldDefinitionValueType<T, K>
}

/** To map a schema to an object where all keys are optional */
export type SchemaDefinitionPartialValues<T extends ISchemaDefinition> = {
	[K in SchemaFieldNames<T>]?: SchemaFieldDefinitionValueType<T, K> | undefined
}

/** Helper to make your schema thinner */
export type SchemaDefinitionValues<
	T extends ISchemaDefinition,
	K extends OptionalFieldNames<T> = OptionalFieldNames<T>,
	V extends SchemaDefinitionAllValues<T> = SchemaDefinitionAllValues<T>
> = Omit<V, K> & Partial<Pick<V, K>>

/** All fields that are optional on the schema */
export type OptionalFieldNames<T extends ISchemaDefinition> = {
	[K in SchemaFieldNames<T>]: T['fields'][K] extends FieldDefinition
		? T['fields'][K]['isRequired'] extends true
			? never
			: K
		: never
}[SchemaFieldNames<T>]

/** All fields that are required on the schema */
export type RequiredFieldNames<T extends ISchemaDefinition> = {
	[K in SchemaFieldNames<T>]: T['fields'][K] extends FieldDefinition
		? T['fields'][K]['isRequired'] extends true
			? K
			: never
		: never
}[SchemaFieldNames<T>]

/** Easy array helper */
type IsArray<T, isArray> = isArray extends true ? T[] : T

/** Easy isRequired helper */
type IsRequired<T, isRequired> = isRequired extends true ? T : T | undefined

/** Get the type of the value of a schemas field */
export type SchemaFieldDefinitionValueType<
	T extends ISchemaDefinition,
	K extends SchemaFieldNames<T>
> = T['fields'][K] extends ISchemaFieldDefinition
	? T['fields'][K]['options']['schema'] extends ISchemaDefinition
		? IsRequired<
				IsArray<
					SchemaDefinitionAllValues<T['fields'][K]['options']['schema']>,
					T['fields'][K]['isArray']
				>,
				T['fields'][K]['isRequired']
		  >
		: IsRequired<
				IsArray<any, T['fields'][K]['isArray']>,
				T['fields'][K]['isRequired']
		  >
	: T['fields'][K] extends FieldDefinition
	? IsRequired<
			IsArray<
				Required<FieldDefinitionMap[T['fields'][K]['type']]>['value'],
				T['fields'][K]['isArray']
			>,
			T['fields'][K]['isRequired']
	  >
	: never

/** A union of all field names */
export type SchemaFieldNames<T extends ISchemaDefinition> = Extract<
	keyof T['fields'],
	string
>

/** Pluck out the field definition from the schema */
export type SchemaFieldDefinition<
	T extends ISchemaDefinition,
	K extends SchemaFieldNames<T>
> = T['fields'][K] extends FieldDefinition ? T['fields'][K]['type'] : never

/** Get the field type for a field from a schema */
export type SchemaDefinitionFieldType<
	T extends ISchemaDefinition,
	K extends SchemaFieldNames<T>
> = T['fields'][K] extends FieldDefinition ? T['fields'][K]['type'] : never

/** Response to getNamedFields */
export interface ISchemaNamedField<T extends ISchemaDefinition> {
	name: SchemaFieldNames<T>
	field: Field
}

/** Options you can pass to schema.get() */
export interface ISchemaGetSetOptions {
	validate?: boolean
}

/** Options for schema.getValues */
export interface ISchemaGetValuesOptions<
	T extends ISchemaDefinition,
	F extends SchemaFieldNames<T>
> extends ISchemaGetSetOptions {
	fields?: F[]
}

/** Options for schema.getNamedFields */
export interface ISchemaNamedFieldsOptions<
	T extends ISchemaDefinition,
	F extends SchemaFieldNames<T>
> {
	fields?: F[]
}

/** Options for schema.validate */
export interface ISchemaValidateOptions<
	T extends ISchemaDefinition,
	F extends SchemaFieldNames<T> = SchemaFieldNames<T>
> extends ISchemaNamedFieldsOptions<T, F> {}

/** Universal schema class  */
export default class Schema<T extends ISchemaDefinition> {
	/** The schema definition */
	public definition: T

	/** The values of this schema */
	public values: SchemaDefinitionPartialValues<T>

	/** All the field objects keyed by field name, use getField rather than accessing this directly */
	public fields: SchemaFields<T>

	/** For caching getNamedFields() */
	// private namedFieldCache: ISchemaNamedField<T>[] | undefined

	public constructor(
		definition: T,
		values?: SchemaDefinitionPartialValues<T>,
		fieldClassMap: Record<FieldType, any> = FieldClassMap
	) {
		// Set definition and values
		this.definition = definition
		this.values = values ? values : {}

		// Pull field definitions off schema definition
		const fieldDefinitions = this.definition.fields
		if (!fieldDefinitions) {
			throw new Error(`Schemas don't support dynamic fields yet`)
		}

		// Empty fields to start
		this.fields = {} as SchemaFields<T>

		Object.keys(fieldDefinitions).forEach(name => {
			const definition = fieldDefinitions[name]
			const field = AbstractField.field(definition, fieldClassMap)
			this.fields[name as SchemaFieldNames<T>] = field
		})
	}

	/** Tells you if a schema definition is valid */
	public static isDefinitionValid(definition: ISchemaDefinition): boolean {
		return !!(
			typeof definition.id === 'string' &&
			typeof definition.name === 'string' &&
			(definition.fields || definition.dynamicKeySignature)
		)
	}

	/** Get any field by name */
	public get<F extends SchemaFieldNames<T>>(
		fieldName: F,
		options: ISchemaGetSetOptions = {}
	): SchemaFieldDefinitionValueType<T, F> {
		// Get value off self
		let value: SchemaFieldDefinitionValueType<T, F> | undefined =
			this.values[fieldName as SchemaFieldNames<T>] !== undefined
				? this.values[fieldName]
				: undefined

		const { validate = true } = options

		// Get field
		const field = this.fields[fieldName]

		// Validate if we're supposed to
		const errors = validate ? field.validate(value) : []

		// If there are any errors, bail
		if (errors.length > 0) {
			throw new SchemaError({
				code: SchemaErrorCode.InvalidField,
				schemaId: this.definition.id,
				errors: [{ fieldName: fieldName as string, errors }]
			})
		}

		// If there is a value, transform it to it's expected value
		if (value !== null && typeof value !== 'undefined') {
			value = field.toValueType(value)
		}

		return value as SchemaFieldDefinitionValueType<T, F>
	}

	/** Set a value and ensure its type */
	public set<F extends SchemaFieldNames<T>>(
		fieldName: F,
		value: SchemaFieldDefinitionValueType<T, F>,
		options: ISchemaGetSetOptions = {}
	): this {
		let localValue = value
		const { validate = true } = options

		// Get the field
		const field = this.fields[fieldName]

		// If there is a value, transform it to it's expected value
		if (localValue !== null && typeof localValue !== 'undefined') {
			localValue = field.toValueType(localValue)
		}

		// Validate if we're supposed to
		const errors = validate ? field.validate(localValue) : []

		if (errors.length > 0) {
			throw new SchemaError({
				code: SchemaErrorCode.InvalidField,
				schemaId: this.definition.id,
				errors: [{ fieldName: fieldName as string, errors }]
			})
		}

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
	public validate(options: ISchemaValidateOptions<T> = {}) {
		const errors: ISchemaErrorOptionsInvalidField['errors'] = []

		this.getNamedFields(options).forEach(item => {
			const { name, field } = item
			const value = this.get(name, { validate: false })
			const fieldErrors = field.validate(value)

			if (fieldErrors.length > 0) {
				errors.push({
					fieldName: name,
					errors: fieldErrors
				})
			}
		})

		if (errors.length > 0) {
			throw new SchemaError({
				code: SchemaErrorCode.InvalidField,
				schemaId: this.definition.id,
				errors
			})
		}
	}

	/** Get all values valued */
	public getValues<F extends SchemaFieldNames<T> = SchemaFieldNames<T>>(
		options: ISchemaGetValuesOptions<T, F> = {}
	): Pick<SchemaDefinitionAllValues<T>, F> {
		const values: SchemaDefinitionPartialValues<T> = { ...this.values }

		const { fields = Object.keys(this.fields) } = options

		this.getNamedFields().forEach(namedField => {
			const { name } = namedField
			if (fields.indexOf(name) > -1) {
				const value = this.get(name, options)
				values[name] = value
			}
		})

		// We know this conforms after the loop above, nothing to do here
		return values as Pick<SchemaDefinitionAllValues<T>, F>
	}

	/** Set a bunch of values at once */
	public setValues(values: SchemaDefinitionPartialValues<T>): this {
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
	public getNamedFields<F extends SchemaFieldNames<T>>(
		options: ISchemaNamedFieldsOptions<T, F> = {}
	): ISchemaNamedField<T>[] {
		// If (this.namedFieldCache) {
		// 	return this.namedFieldCache
		// }
		const namedFields: ISchemaNamedField<T>[] = []
		const { fields = Object.keys(this.fields) as F[] } = options

		fields.forEach(name => {
			const field = this.fields[name]
			namedFields.push({ name, field })
		})

		// This.namedFieldCache = namedFields

		return namedFields
	}
}
