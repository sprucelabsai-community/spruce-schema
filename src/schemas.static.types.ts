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

export interface ISchemaEntity<S extends ISchema> {
	schemaId: S['id']
	description?: string
	version?: string
	values: SchemaPartialValues<S>

	get<
		F extends SchemaFieldNames<S>,
		CreateEntityInstances extends boolean = true
	>(
		fieldName: F,
		options?: ISchemaNormalizeOptions<S, CreateEntityInstances>
	): SchemaFieldValueType<S, F, CreateEntityInstances>

	getValues<
		F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
		CreateEntityInstances extends boolean = true
	>(
		options?: ISchemaGetValuesOptions<S, F, CreateEntityInstances>
	): Pick<SchemaAllValues<S, CreateEntityInstances>, F>
}

/** The structure of schema.fields. key is field name, value is field definition */
export interface ISchemaFields {
	[fieldName: string]: FieldDefinition
}

/** A schema defines the data structure of something */
export interface ISchema {
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
	fields?: ISchemaFields
}

export interface ISchemaFieldValueUnion<
	V extends Record<string, any> = Record<string, any>
> {
	schemaId: string
	version?: string
	values: V
}

/** Options passed to toValueType */

export type SchemaFields<T extends ISchema> = {
	[F in SchemaFieldNames<T>]: T['fields'][F] extends IFieldDefinition
		? IFieldMap[T['fields'][F]['type']]
		: never
}

/** To map a schema to an object with values whose types match */
export type SchemaAllValues<
	S extends ISchema,
	CreateEntityInstances extends boolean = false
> = {
	[K in SchemaFieldNames<S>]-?: SchemaFieldValueType<
		S,
		K,
		CreateEntityInstances
	>
}

/** To map a schema to an object where all keys are optional */
export type SchemaPartialValues<
	T extends ISchema,
	CreateEntityInstances extends boolean = false
> = {
	[K in SchemaFieldNames<T>]?:
		| SchemaFieldValueType<T, K, CreateEntityInstances>
		| undefined
		| null
}

/** Turn a schema until it's "values" type */
export type SchemaValues<
	T extends ISchema,
	CreateEntityInstances extends boolean = false,
	K extends OptionalFieldNames<T> = OptionalFieldNames<T>,
	V extends SchemaAllValues<T, CreateEntityInstances> = SchemaAllValues<
		T,
		CreateEntityInstances
	>
> = Omit<V, K> & Partial<Pick<V, K>>

/** Only the default values of a definition */
export type SchemaDefaultValues<
	S extends ISchema,
	CreateEntityInstances extends boolean = false,
	K extends FieldNamesWithDefaultValueSet<S> = FieldNamesWithDefaultValueSet<S>,
	V extends SchemaAllValues<S, CreateEntityInstances> = SchemaAllValues<
		S,
		CreateEntityInstances
	>
> = {
	[F in K]: NonNullable<V[F]>
}

export type SchemaValuesWithDefaults<T extends ISchema> = SchemaValues<T> &
	SchemaDefaultValues<T>

/** All fields that are optional on the schema */
export type OptionalFieldNames<T extends ISchema> = {
	[K in SchemaFieldNames<T>]: T['fields'][K] extends FieldDefinition
		? T['fields'][K]['isRequired'] extends true
			? never
			: K
		: never
}[SchemaFieldNames<T>]

/** All fields that are required on the schema */
export type RequiredFieldNames<T extends ISchema> = {
	[K in SchemaFieldNames<T>]: T['fields'][K] extends FieldDefinition
		? T['fields'][K]['isRequired'] extends true
			? K
			: never
		: never
}[SchemaFieldNames<T>]

/** Gets you all field names that have a default value set */
export type FieldNamesWithDefaultValueSet<T extends ISchema> = {
	[K in SchemaFieldNames<T>]: T['fields'][K] extends FieldDefinition
		? T['fields'][K]['defaultValue'] extends Required<
				T['fields'][K]['defaultValue']
		  >
			? K
			: never
		: never
}[SchemaFieldNames<T>]

export type SchemaFieldValueType<
	S extends ISchema,
	K extends SchemaFieldNames<S>,
	CreateEntityInstances extends boolean = false
> = S['fields'][K] extends FieldDefinition
	? FieldDefinitionValueType<S['fields'][K], CreateEntityInstances>
	: never

/** A union of all field names */
export type SchemaFieldNames<T extends ISchema> = Extract<
	keyof T['fields'],
	string
>

/** Pluck out the field definition from the schema */
export type SchemaFieldDefinition<
	T extends ISchema,
	K extends SchemaFieldNames<T>
> = T['fields'][K] extends FieldDefinition ? T['fields'][K]['type'] : never

/** Get the field type for a field from a schema */
export type SchemaFieldType<
	T extends ISchema,
	K extends SchemaFieldNames<T>
> = T['fields'][K] extends FieldDefinition ? T['fields'][K]['type'] : never

/** Response to getNamedFields */
export interface ISchemaNamedField<T extends ISchema> {
	name: SchemaFieldNames<T>
	field: Field
}

/** Options you can pass to schema.get() */
export interface ISchemaNormalizeOptions<
	S extends ISchema,
	CreateEntityInstances extends boolean
> {
	/** Should i validate any values passed through */
	validate?: boolean
	/** Should I create schema instances for schema fields (defaults to true) */
	createEntityInstances?: CreateEntityInstances
	/** Options passed to each field that conforms to the field definition's options */
	byField?: {
		[K in SchemaFieldNames<S>]?: S['fields'][K] extends IFieldDefinition
			? Partial<IFieldDefinitionMap[S['fields'][K]['type']]['options']>
			: never
	}
}

/** Options for schema.getValues */
export interface ISchemaGetValuesOptions<
	T extends ISchema,
	F extends SchemaFieldNames<T>,
	CreateEntityInstances extends boolean
> extends ISchemaNormalizeOptions<T, CreateEntityInstances> {
	fields?: F[]
}
/** Options for schema.getDefaultValues */
export interface ISchemaGetDefaultValuesOptions<
	T extends ISchema,
	F extends FieldNamesWithDefaultValueSet<T>,
	CreateEntityInstances extends boolean
> extends ISchemaNormalizeOptions<T, CreateEntityInstances> {
	fields?: F[]
}

/** Options for schema.getNamedFields */
export interface ISchemaNamedFieldsOptions<
	T extends ISchema,
	F extends SchemaFieldNames<T>
> {
	fields?: F[]
}

/** Options for schema.validate */
export interface ISchemaValidateOptions<
	T extends ISchema,
	F extends SchemaFieldNames<T> = SchemaFieldNames<T>
> extends ISchemaNamedFieldsOptions<T, F> {}

/** Field names for all matching type */
export type PickFieldNames<S extends ISchema, T extends FieldType> = {
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
