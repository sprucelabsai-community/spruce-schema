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

/** the structure of schema.fields. key is field name, value is field definition */
export interface ISchemaFieldsDefinition {
	[fieldName: string]: IFieldDefinition
}

// TODO make this actually pull the field types from the class map and fix all corresponding lint errors
/** the form of schema.fields based on an actual definition  */
export type SchemaDefinitionFields<T extends ISchemaDefinition> = Record<
	SchemaFieldNames<T>,
	Field
>
/** A schema defines the data structure of something */
export interface ISchemaDefinition {
	/** give this schema a machine friendly id */
	id: string
	/** the name of this schema a human will see */
	name: string
	/** a brief human readable explanation of this schema */
	description?: string
	/** how we type dynamic keys on this schema, if defined you cannot define fields */
	dynamicKeySignature?: IFieldDefinition & { key: string }
	/** all the fields, keyed by name, required if no dynamicKeySignature is set */
	fields?: ISchemaFieldsDefinition
}

/** to map a schema to an object with values whose types match */
export type SchemaDefinitionAllValues<T extends ISchemaDefinition> = {
	[K in SchemaFieldNames<T>]: SchemaFieldDefinitionValueType<T, K>
}

/** helper to make your schema thinner */
export type SchemaDefinitionValues<
	T extends ISchemaDefinition,
	K extends OptionalFieldNames<T> = OptionalFieldNames<T>,
	V extends SchemaDefinitionAllValues<T> = SchemaDefinitionAllValues<T>
> = Omit<V, K> & Partial<Pick<V, K>>

/** all fields that are optional on the schema */
export type OptionalFieldNames<T extends ISchemaDefinition> = {
	[K in SchemaFieldNames<T>]: T['fields'][K] extends IFieldDefinition
		? T['fields'][K]['isRequired'] extends true
			? never
			: K
		: never
}[SchemaFieldNames<T>]

/** all fields that are required on the schema */
export type RequiredFieldNames<T extends ISchemaDefinition> = {
	[K in SchemaFieldNames<T>]: T['fields'][K] extends IFieldDefinition
		? T['fields'][K]['isRequired'] extends true
			? K
			: never
		: never
}[SchemaFieldNames<T>]

/** easy array helper */
type IsArray<T, isArray> = isArray extends true ? T[] : T

/** easy isRequired helper */
type IsRequired<T, isRequired> = isRequired extends true ? T : T | undefined

/** get the type of the value of a schemas field */
export type SchemaFieldDefinitionValueType<
	T extends ISchemaDefinition,
	K extends SchemaFieldNames<T>
> = T['fields'][K] extends IFieldSchemaDefinition
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
	: T['fields'][K] extends IFieldDefinition
	? IsRequired<
			IsArray<
				Required<FieldDefinitionMap[T['fields'][K]['type']]>['value'],
				T['fields'][K]['isArray']
			>,
			T['fields'][K]['isRequired']
	  >
	: never

/** a union of all field names */
export type SchemaFieldNames<T extends ISchemaDefinition> = Extract<
	keyof T['fields'],
	string
>

/** pluck out the field definition from the schema */
export type SchemaFieldDefinition<
	T extends ISchemaDefinition,
	K extends SchemaFieldNames<T>
> = T['fields'][K] extends IFieldDefinition ? T['fields'][K]['type'] : never

/** get the field type for a field from a schema */
export type SchemaDefinitionFieldType<
	T extends ISchemaDefinition,
	K extends SchemaFieldNames<T>
> = T['fields'][K] extends IFieldDefinition ? T['fields'][K]['type'] : never

/** response to getNamedFields */
export interface ISchemaNamedField<T extends ISchemaDefinition> {
	name: SchemaFieldNames<T>
	field: Field
}

/** options you can pass to schema.get() */
export interface ISchemaGetSetOptions {
	validate?: boolean
}

/** options for schema.getValues */
export interface ISchemaGetValuesOptions<
	T extends ISchemaDefinition,
	F extends SchemaFieldNames<T>
> extends ISchemaGetSetOptions {
	fields?: F[]
}

/** options for schema.getNamedFields */
export interface ISchemaNamedFieldsOptions<
	T extends ISchemaDefinition,
	F extends SchemaFieldNames<T>
> {
	fields?: F[]
}
/** options for schema.validate */
export interface ISchemaValidateOptions<
	T extends ISchemaDefinition,
	F extends SchemaFieldNames<T> = SchemaFieldNames<T>
> extends ISchemaNamedFieldsOptions<T, F> {}
/** universal schema class  */
export default class Schema<T extends ISchemaDefinition> {
	/** the schema definition */
	public definition: T

	/** the values of this schema */
	public values: Partial<SchemaDefinitionAllValues<T>>

	/** all the field objects keyed by field name, use getField rather than accessing this directly */
	public fields: SchemaDefinitionFields<T>

	/** for caching getNamedFields() */
	// private namedFieldCache: ISchemaNamedField<T>[] | undefined

	public constructor(
		definition: T,
		values?: Partial<SchemaDefinitionAllValues<T>>,
		fieldClassMap: Record<FieldType, any> = FieldClassMap
	) {
		// set definition and values
		this.definition = definition
		this.values = values ? values : {}

		// pull field definitions off schema definition
		const fieldDefinitions = this.definition.fields
		if (!fieldDefinitions) {
			throw new Error(`Schemas don't support dynamic fields yet`)
		}

		// empty fields to start
		this.fields = {} as SchemaDefinitionFields<T>

		Object.keys(fieldDefinitions).forEach(name => {
			const definition = fieldDefinitions[name]
			const field = FieldBase.field(definition, fieldClassMap)
			this.fields[name as SchemaFieldNames<T>] = field
		})
	}

	/** tells you if a schema definition is valid */
	public static isDefinitionValid(definition: ISchemaDefinition): boolean {
		return !!(
			typeof definition.id === 'string' &&
			typeof definition.name === 'string' &&
			(definition.fields || definition.dynamicKeySignature)
		)
	}

	/** get any field by name */
	public get<F extends Extract<keyof T['fields'], string>>(
		fieldName: F,
		options: ISchemaGetSetOptions = {}
	): SchemaFieldDefinitionValueType<T, F> {
		// get value off self
		let value: SchemaFieldDefinitionValueType<T, F> | undefined =
			this.values[fieldName as SchemaFieldNames<T>] !== undefined
				? this.values[fieldName]
				: undefined

		const { validate = true } = options

		// get field
		const field = this.fields[fieldName]

		// validate if we're supposed to
		const errors = validate ? field.validate(value) : []

		// if there are any errors, bail
		if (errors.length > 0) {
			throw new SchemaError({
				code: SchemaErrorCode.InvalidField,
				schemaId: this.definition.id,
				errors: [{ fieldName: fieldName as string, errors }]
			})
		}

		// if there is a value, transform it to it's expected value
		if (value !== null && typeof value !== 'undefined') {
			value = field.toValueType(value)
		}

		return value as SchemaFieldDefinitionValueType<T, F>
	}

	/** set a value and ensure its type */
	public set<F extends SchemaFieldNames<T>>(
		fieldName: F,
		value: SchemaFieldDefinitionValueType<T, F>,
		options: ISchemaGetSetOptions = {}
	): this {
		let localValue = value
		const { validate = true } = options

		// get the field
		const field = this.fields[fieldName]

		// if there is a value, transform it to it's expected value
		if (localValue !== null && typeof localValue !== 'undefined') {
			localValue = field.toValueType(localValue)
		}

		// validate if we're supposed to
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

	/** is this schema valid? */
	public isValid() {
		try {
			this.validate()
			return true
		} catch {
			return false
		}
	}

	/** returns an array of schema validation errors */
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

	/** get all values valued */
	public getValues<F extends SchemaFieldNames<T> = SchemaFieldNames<T>>(
		options: ISchemaGetValuesOptions<T, F> = {}
	): Pick<SchemaDefinitionAllValues<T>, F> {
		const values: Partial<SchemaDefinitionAllValues<T>> = { ...this.values }

		const { fields = Object.keys(this.fields) } = options

		this.getNamedFields().forEach(namedField => {
			const { name } = namedField
			if (fields.indexOf(name) > -1) {
				const value = this.get(name, options)
				values[name] = value
			}
		})

		// we know this conforms after the loop above, nothing to do here
		return values as Pick<SchemaDefinitionAllValues<T>, F>
	}

	/** set a bunch of values at once */
	public setValues(values: Partial<SchemaDefinitionAllValues<T>>): this {
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

	/** get all fields as an array for easy looping and mapping */
	public getNamedFields<F extends SchemaFieldNames<T>>(
		options: ISchemaNamedFieldsOptions<T, F> = {}
	): ISchemaNamedField<T>[] {
		// if (this.namedFieldCache) {
		// 	return this.namedFieldCache
		// }
		const namedFields: ISchemaNamedField<T>[] = []
		const { fields = Object.keys(this.fields) as F[] } = options

		fields.forEach(name => {
			const field = this.fields[name]
			namedFields.push({ name, field })
		})

		// this.namedFieldCache = namedFields

		return namedFields
	}
}
