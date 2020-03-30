import {
	FieldType,
	IFieldDefinition,
	FieldDefinitionMap,
	FieldClassMap,
	Field,
	FieldBase,
	IFieldSchemaDefinition
} from './fields'
import SchemaError from './errors/SchemaError'
import {
	SchemaErrorCode,
	ISchemaErrorOptionsInvalidField
} from './errors/types'

/** The structure of schema.fields. key is field name, value is field definition */
export interface ISchemaFieldsDefinition {
	[fieldName: string]: IFieldDefinition
}

// TODO make this actually pull the field types from the class map and fix all corresponding lint errors
/** the form of schema.fields based on an actual definition  */
export type SchemaDefinitionFields<T extends ISchemaDefinition> = Record<
	SchemaDefinitionFieldNames<T>,
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
	dynamicKeySignature?: IFieldDefinition & { key: string }
	/** All the fields, keyed by name, required if no dynamicKeySignature is set */
	fields?: ISchemaFieldsDefinition
}

/** To map a schema to an object with values whose types match */
export type SchemaDefinitionValues<T extends ISchemaDefinition> = {
	[K in keyof T['fields']]: SchemaFieldDefinitionValueType<T, K>
}

/** Easy isRequired helper */
type IsRequired<T, isRequired> = isRequired extends true ? T : T | undefined

/** Get the type of the value of a schema's field */
export type SchemaFieldDefinitionValueType<
	T extends ISchemaDefinition,
	K extends keyof T['fields']
> = T['fields'][K] extends IFieldSchemaDefinition
	? T['fields'][K]['options']['schema'] extends ISchemaDefinition
		? IsRequired<
				SchemaDefinitionValues<T['fields'][K]['options']['schema']>,
				T['fields'][K]['isRequired']
		  >
		: IsRequired<any, T['fields'][K]['isRequired']>
	: T['fields'][K] extends IFieldDefinition
	? IsRequired<
			Required<FieldDefinitionMap[T['fields'][K]['type']]>['value'],
			T['fields'][K]['isRequired']
	  >
	: never

/** A union of all field names */
export type SchemaDefinitionFieldNames<T extends ISchemaDefinition> = Extract<
	keyof T['fields'],
	string
>

/** Pluck out the field definition from the schema */
export type SchemaFieldDefinition<
	T extends ISchemaDefinition,
	K extends keyof T['fields']
> = T['fields'][K] extends IFieldDefinition ? T['fields'][K]['type'] : never

/** Get the field type for a field from a schema */
export type SchemaDefinitionFieldType<
	T extends ISchemaDefinition,
	K extends keyof T['fields']
> = T['fields'][K] extends IFieldDefinition ? T['fields'][K]['type'] : never

/** Response to getNamedFields */
export interface ISchemaNamedField<T extends ISchemaDefinition> {
	name: SchemaDefinitionFieldNames<T>
	field: Field
}

/** Options you can pass to schema.get() */
export interface ISchemaGetSetOptions {
	validate?: boolean
}

/** Universal schema class  */
export default class Schema<T extends ISchemaDefinition> {
	/** The schema definition */
	public definition: T

	/** The values of this schema */
	public values: Partial<SchemaDefinitionValues<T>>

	/** All the field objects keyed by field name, use getField rather than accessing this directly */
	public fields: SchemaDefinitionFields<T>

	/** For caching getNamedFields() */
	private namedFieldCache: ISchemaNamedField<T>[] | undefined

	public constructor(
		definition: T,
		values?: Partial<SchemaDefinitionValues<T>>,
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
		this.fields = {} as SchemaDefinitionFields<T>

		Object.keys(fieldDefinitions).forEach(name => {
			const definition = fieldDefinitions[name]
			const field = FieldBase.field(definition, fieldClassMap)
			this.fields[name as SchemaDefinitionFieldNames<T>] = field
		})
	}

	/** Get any field by name */
	public get<F extends SchemaDefinitionFieldNames<T>>(
		fieldName: F,
		options: ISchemaGetSetOptions = {}
	): SchemaFieldDefinitionValueType<T, F> {
		// Get value off self
		let value: SchemaFieldDefinitionValueType<T, F> | undefined =
			typeof this.values[fieldName] !== undefined
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
	public set<F extends SchemaDefinitionFieldNames<T>>(
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
	public validate() {
		const errors: ISchemaErrorOptionsInvalidField['errors'] = []

		this.getNamedFields().forEach(item => {
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
	public getValues(options?: ISchemaGetSetOptions): SchemaDefinitionValues<T> {
		const values: Partial<SchemaDefinitionValues<T>> = { ...this.values }

		this.getNamedFields().forEach(namedField => {
			const { name } = namedField
			const value = this.get(name, options)
			values[name] = value
		})

		// We know this conforms after the loop above, nothing to do here
		return values as SchemaDefinitionValues<T>
	}

	/** Set a bunch of values at once */
	public setValues(values: Partial<SchemaDefinitionValues<T>>): this {
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
	public getNamedFields(): ISchemaNamedField<T>[] {
		if (this.namedFieldCache) {
			return this.namedFieldCache
		}
		const namedFields: ISchemaNamedField<T>[] = []

		const names = Object.keys(this.fields) as SchemaDefinitionFieldNames<T>[]

		names.forEach(name => {
			const field = this.fields[name]
			namedFields.push({ name, field })
		})

		this.namedFieldCache = namedFields

		return namedFields
	}
}
