// This is the static compliment to #spruce/schemas/schema/schemas.types
import {
	FieldDefinition,
	Field,
	IFieldDefinitionMap,
	IFieldMap,
} from '#spruce/schemas/fields/fields.types'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import {
	IFieldDefinition,
	FieldDefinitionValueType,
} from './fields/field.static.types'

export interface ISchema<S extends ISchemaDefinition> {
	schemaId: S['id']
	description?: string
	version?: string
	values: SchemaDefinitionPartialValues<S>

	get<
		F extends SchemaFieldNames<S>,
		CreateSchemaInstances extends boolean = true
	>(
		fieldName: F,
		options?: ISchemaNormalizeOptions<S, CreateSchemaInstances>
	): SchemaFieldDefinitionValueType<S, F, CreateSchemaInstances>

	getValues<
		F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
		CreateSchemaInstances extends boolean = true
	>(
		options?: ISchemaGetValuesOptions<S, F, CreateSchemaInstances>
	): Pick<SchemaDefinitionAllValues<S, CreateSchemaInstances>, F>
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
	/** A version in any form you want, we use YYYY-MM-DD */
	version?: string
	/** A brief human readable explanation of this schema */
	description?: string
	/** How we type dynamic keys on this schema, if defined you cannot define fields */
	dynamicKeySignature?: FieldDefinition & { key: string }
	/** All the fields, keyed by name, required if no dynamicKeySignature is set */
	fields?: ISchemaDefinitionFields
}

export interface ISchemaFieldDefinitionValueUnion<
	V extends Record<string, any> = Record<string, any>
> {
	schemaId: string
	version?: string
	values: V
}

/** Options passed to toValueType */

export type SchemaFields<T extends ISchemaDefinition> = {
	[F in SchemaFieldNames<T>]: T['fields'][F] extends IFieldDefinition
		? IFieldMap[T['fields'][F]['type']]
		: never
}

/** To map a schema to an object with values whose types match */
export type SchemaDefinitionAllValues<
	S extends ISchemaDefinition,
	CreateSchemaInstances extends boolean = false
> = {
	[K in SchemaFieldNames<S>]-?: SchemaFieldDefinitionValueType<
		S,
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
		| null
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
	S extends ISchemaDefinition,
	CreateSchemaInstances extends boolean = false,
	K extends FieldNamesWithDefaultValueSet<S> = FieldNamesWithDefaultValueSet<S>,
	V extends SchemaDefinitionAllValues<
		S,
		CreateSchemaInstances
	> = SchemaDefinitionAllValues<S, CreateSchemaInstances>
> = {
	[F in K]: NonNullable<V[F]>
}

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

export type SchemaFieldDefinitionValueType<
	S extends ISchemaDefinition,
	K extends SchemaFieldNames<S>,
	CreateSchemaInstances extends boolean = false
> = S['fields'][K] extends FieldDefinition
	? FieldDefinitionValueType<S['fields'][K], CreateSchemaInstances>
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
	S extends ISchemaDefinition,
	CreateSchemaInstances extends boolean
> {
	/** Should i validate any values passed through */
	validate?: boolean
	/** Should I create schema instances for schema fields (defaults to true) */
	createSchemaInstances?: CreateSchemaInstances
	/** Options passed to each field that conforms to the field definition's options */
	byField?: {
		[K in SchemaFieldNames<S>]?: S['fields'][K] extends IFieldDefinition
			? Partial<IFieldDefinitionMap[S['fields'][K]['type']]['options']>
			: never
	}
}

/** Options for schema.getValues */
export interface ISchemaGetValuesOptions<
	T extends ISchemaDefinition,
	F extends SchemaFieldNames<T>,
	CreateSchemaInstances extends boolean
> extends ISchemaNormalizeOptions<T, CreateSchemaInstances> {
	fields?: F[]
}
/** Options for schema.getDefaultValues */
export interface ISchemaGetDefaultValuesOptions<
	T extends ISchemaDefinition,
	F extends FieldNamesWithDefaultValueSet<T>,
	CreateSchemaInstances extends boolean
> extends ISchemaNormalizeOptions<T, CreateSchemaInstances> {
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

/** Field names for all matching type */
export type PickFieldNames<S extends ISchemaDefinition, T extends FieldType> = {
	[F in keyof S['fields']]: S['fields'][F] extends FieldDefinition
		? S['fields'][F]['type'] extends T
			? F
			: never
		: never
}[Extract<keyof S['fields'], string>]

export interface ISchemaIdWithVersion {
	id: string
	version?: string
}
