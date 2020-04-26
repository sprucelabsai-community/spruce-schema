import {
	FieldDefinition,
	Field,
	FieldDefinitionMap
} from '#spruce:schema/fields/fields.types'
import { FieldType } from '#spruce:schema/fields/fieldType'
import { ISchemaFieldDefinition } from './fields/SchemaField'
import { ISelectFieldDefinition } from './fields/SelectField'
import { IInvalidFieldError } from './errors/error.types'

export interface ISchema<T extends ISchemaDefinition> {
	/** The id of the schema (for union resolution) */
	schemaId: T['id']
	/** The definition associated with this schema */
	definition: T
	/** The values of this schema */
	values: SchemaDefinitionPartialValues<T>
	/** Get a value for particular field  */
	get<
		F extends SchemaFieldNames<T>,
		CreateSchemaInstances extends boolean = true
	>(
		fieldName: F,
		options?: ISchemaNormalizeOptions<CreateSchemaInstances>
	): SchemaFieldDefinitionValueType<T, F, CreateSchemaInstances>

	/** Get all values for all fields */
	getValues<
		F extends SchemaFieldNames<T> = SchemaFieldNames<T>,
		CreateSchemaInstances extends boolean = true
	>(
		options?: ISchemaGetValuesOptions<T, F, CreateSchemaInstances>
	): Pick<SchemaDefinitionAllValues<T, CreateSchemaInstances>, F>
}

/** The structure of schema.fields. key is field name, value is field definition */
export interface ISchemaDefinitionFields {
	[fieldName: string]: FieldDefinition
}

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

export type IFieldDefinition<
	Value = any,
	DefaultValue = Partial<Value>,
	ArrayValue = Value[],
	DefaultArrayValue = Partial<Value>[]
> = {
	/** The filed type */
	type: FieldType
	/** Default options are empty */
	options?: {}
	/** Generates in only for local interface and does not share with other skills */
	isPrivate?: boolean
	/** The permissions used in different contexts */
	acls?: {
		create: {
			[slug: string]: string[]
		}
		read: {
			[slug: string]: string[]
		}
		update: {
			[slug: string]: string[]
		}
		delete: {
			[slug: string]: string[]
		}
	}
	/** How this field is represented to the end-user as an html label or when collecting input from cli */
	label?: string
	/** Give an example of how someone should think about this field or give an example of what it may be */
	hint?: string
	/** Is this field required */
	isRequired?: boolean
} & (
	| {
			/** * If this element is an array */
			isArray: true
			/** The default for for this if no value is set */
			defaultValue?: DefaultArrayValue
			/** The current value for this field */
			value?: ArrayValue
	  }
	| {
			/** * If this value is NOT an array */
			isArray?: false | undefined
			/** The default value for this if no value is set */
			defaultValue?: DefaultValue
			/** The current value for this field */
			value?: Value
	  }
)

/** A type that matches a subclass of the abstract field */
export type FieldSubclass<F extends FieldDefinition> = new (
	name: string,
	definition: F
) => IField<F>

/** A field that comprises a schema */
export interface IField<F extends FieldDefinition> {
	/** The definition for this field */
	readonly definition: F
	/** The type of field */
	readonly type: F['type']
	/** The fields options */
	readonly options: F['options']
	/** If this field is required */
	readonly isRequired: F['isRequired']
	/** If this field is an array */
	readonly isArray: F['isArray']
	/** The field's label */
	readonly label: F['label']
	/** The field's hint */
	readonly hint: F['hint']
	/** The name of this field (camel case) */
	readonly name: string
	/** Validate a value */
	validate(value: any, options?: IValidateOptions): IInvalidFieldError[]
	/** Transform any value to the value type of this field. should take anything and return a valid value or blow up. Will never receive undefined */
	toValueType<CreateSchemaInstances extends boolean>(
		value: any,
		options?: IToValueTypeOptions<CreateSchemaInstances>
	): Exclude<FieldDefinitionValueType<F, CreateSchemaInstances>, undefined>
}

/** Options passed to validate() */
export interface IValidateOptions {
	/** All definitions we're validating against */
	definitionsById?: { [id: string]: ISchemaDefinition }
}

export interface IFieldDefinitionToSchemaDefinitionOptions {
	/** All definitions we're validating against */
	definitionsById?: { [id: string]: ISchemaDefinition }
}

export interface ISchemaFieldDefinitionValueUnion {
	schemaId: string
	values: Record<string, any>
}

/** Options passed to toValueType */
export interface IToValueTypeOptions<
	CreateSchemaInstances extends boolean = true
> {
	/** All definitions by id for lookups by fields */
	definitionsById?: { [id: string]: ISchemaDefinition }
	/** Create and return a new Schema()  */
	createSchemaInstances?: CreateSchemaInstances
}

// TODO make this actually pull the field types from the class map and fix all corresponding lint errors
/** the form of schema.fields based on an actual definition  */
export type SchemaFields<T extends ISchemaDefinition> = Record<
	SchemaFieldNames<T>,
	IField<any>
>

/** To map a schema to an object with values whose types match */
export type SchemaDefinitionAllValues<
	T extends ISchemaDefinition,
	CreateSchemaInstances extends boolean = false
> = {
	[K in SchemaFieldNames<T>]: SchemaFieldDefinitionValueType<
		T,
		K,
		CreateSchemaInstances
	>
}

/** To map a schema to an object where all keys are optional */
export type SchemaDefinitionPartialValues<
	T extends ISchemaDefinition,
	CreateSchemaInstances extends boolean = false
> = {
	[K in SchemaFieldNames<T>]?:
		| SchemaFieldDefinitionValueType<T, K, CreateSchemaInstances>
		| undefined
}

/** Turn a schema until it's "values" type */
export type SchemaDefinitionValues<
	T extends ISchemaDefinition,
	CreateSchemaInstances extends boolean = false,
	K extends OptionalFieldNames<T> = OptionalFieldNames<T>,
	V extends SchemaDefinitionAllValues<
		T,
		CreateSchemaInstances
	> = SchemaDefinitionAllValues<T, CreateSchemaInstances>
> = Omit<V, K> & Partial<Pick<V, K>>

/** Only the default values of a definition */
export type SchemaDefinitionDefaultValues<
	T extends ISchemaDefinition,
	CreateSchemaInstances extends boolean = false,
	K extends FieldNamesWithDefaultValueSet<T> = FieldNamesWithDefaultValueSet<T>,
	V extends SchemaDefinitionAllValues<
		T,
		CreateSchemaInstances
	> = SchemaDefinitionAllValues<T, CreateSchemaInstances>
> = Pick<V, K>

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

/** Gets you all field names that have a default value set */
export type FieldNamesWithDefaultValueSet<T extends ISchemaDefinition> = {
	[K in SchemaFieldNames<T>]: T['fields'][K] extends FieldDefinition
		? T['fields'][K]['defaultValue'] extends Required<
				T['fields'][K]['defaultValue']
		  >
			? K
			: never
		: never
}[SchemaFieldNames<T>]

/** Make a thing that was an array not an array so isArray can control it */
type Unpack<A> = A extends Array<infer E> ? E : A

/** Easy array helper */
type IsArray<T, isArray> = isArray extends true ? Unpack<T>[] : Unpack<T>

/** Array help that does not unpack (you could get array of arrays with this) */
type IsArrayNoUnpack<T, isArray> = isArray extends true ? T[] : T

/** Easy isRequired helper */
type IsRequired<T, isRequired> = isRequired extends true ? T : T | undefined

type SchemaFieldUnion<
	S extends Array<ISchemaDefinition>,
	CreateSchemaInstances extends boolean = false
> = {
	[K in keyof S]: S[K] extends ISchemaDefinition
		? CreateSchemaInstances extends true
			? ISchema<S[K]>
			: {
					schemaId: S[K]['id']
					values: SchemaDefinitionValues<S[K]>
			  }
		: any
}

export type SchemaFieldValueType<
	F extends ISchemaFieldDefinition,
	CreateSchemaInstances extends boolean = false
> = F['options']['schemas'] extends Array<ISchemaDefinition>
	? IsArrayNoUnpack<
			SchemaFieldUnion<F['options']['schemas'], CreateSchemaInstances>[number],
			F['isArray']
	  >
	: F['options']['schema'] extends ISchemaDefinition
	? CreateSchemaInstances extends true
		? IsArray<ISchema<F['options']['schema']>, F['isArray']>
		: IsArray<SchemaDefinitionValues<F['options']['schema']>, F['isArray']>
	: any

export type FieldValidationAssertion<F extends FieldDefinition> =
	| FieldDefinitionValueType<F, false>
	| FieldDefinitionValueType<F, true>

export type FieldDefinitionValueType<
	F extends FieldDefinition,
	CreateSchemaInstances extends boolean = false
> = F extends ISchemaFieldDefinition // Schema field
	? SchemaFieldValueType<F, CreateSchemaInstances>
	: F extends ISelectFieldDefinition // Select field
	? F['options']['choices'][number]['value']
	: F extends FieldDefinition // All fields
	? IsRequired<
			IsArray<Required<FieldDefinitionMap[F['type']]>['value'], F['isArray']>,
			F['isRequired']
	  >
	: never

/** Get the type of the value of a schemas field */
export type SchemaFieldDefinitionValueType<
	T extends ISchemaDefinition,
	K extends SchemaFieldNames<T>,
	CreateSchemaInstances extends boolean = false
> = T['fields'][K] extends FieldDefinition
	? FieldDefinitionValueType<T['fields'][K], CreateSchemaInstances>
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
export interface ISchemaNormalizeOptions<
	CreateSchemaInstances extends boolean
> {
	/** Should i validate any values passed through */
	validate?: boolean
	/** Should I create schema instances for schema fields (defaults to true) */
	createSchemaInstances?: CreateSchemaInstances
}

/** Options for schema.getValues */
export interface ISchemaGetValuesOptions<
	T extends ISchemaDefinition,
	F extends SchemaFieldNames<T>,
	CreateSchemaInstances extends boolean
> extends ISchemaNormalizeOptions<CreateSchemaInstances> {
	fields?: F[]
}
/** Options for schema.getDefaultValues */
export interface ISchemaGetDefaultValuesOptions<
	T extends ISchemaDefinition,
	F extends FieldNamesWithDefaultValueSet<T>,
	CreateSchemaInstances extends boolean
> extends ISchemaNormalizeOptions<CreateSchemaInstances> {
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
