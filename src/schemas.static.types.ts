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
		: Pick<SchemaAllValues<S, CreateEntityInstances>, F>
}

/** The structure of schema.fields. key is field name, value is field definition */
export interface ISchemaFields {
	[fieldName: string]: FieldDefinition
}

export type DynamicFieldSignature = FieldDefinition & {
	/** How the key is named in the generated interface */
	keyName: string
	/** Defaults to string */
	keyTypeLiteral?: string
}

/** A schema defines the data structure of something */
export interface ISchema {
	/** Give this schema a machine friendly id */
	id: string
	/** The name of this schema a human will see */
	name: string
	/** The builder used to make this schema */
	readonly builder?: string
	/** A version in any form you want, we use YYYY-MM-DD */
	version?: string
	/** A brief human readable explanation of this schema */
	description?: string
	/** How we type dynamic keys on this schema, if defined you cannot define fields */
	dynamicFieldSignature?: DynamicFieldSignature
	/** All the fields, keyed by name, required if no dynamicFieldSignature is set */
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
	[F in SchemaFieldNames<
		T
	>]: T['dynamicFieldSignature'] extends DynamicFieldSignature
		? IFieldMap[T['dynamicFieldSignature']['type']]
		: T['fields'] extends ISchemaFields
		? T['fields'][F] extends IFieldDefinition
			? IFieldMap[T['fields'][F]['type']]
			: never
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
	K extends SchemaOptionalFieldNames<T> = SchemaOptionalFieldNames<T>,
	V extends SchemaAllValues<T, CreateEntityInstances> = SchemaAllValues<
		T,
		CreateEntityInstances
	>
> = Omit<V, K> & Partial<Pick<V, K>>

export type SchemaDefaultValues<
	S extends ISchema,
	CreateEntityInstances extends boolean = false,
	K extends SchemaFieldNamesWithDefaultValue<
		S
	> = SchemaFieldNamesWithDefaultValue<S>,
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
export type SchemaOptionalFieldNames<T extends ISchema> = {
	[K in SchemaFieldNames<
		T
	>]: T['dynamicFieldSignature'] extends DynamicFieldSignature
		? T['dynamicFieldSignature']['isRequired'] extends true
			? never
			: K
		: T['fields'] extends ISchemaFields
		? T['fields'][K] extends FieldDefinition
			? T['fields'][K]['isRequired'] extends true
				? never
				: K
			: never
		: never
}[SchemaFieldNames<T>]

/** All fields that are required on the schema */
export type SchemaRequiredFieldNames<T extends ISchema> = {
	[K in SchemaFieldNames<
		T
	>]: T['dynamicFieldSignature'] extends DynamicFieldSignature
		? T['dynamicFieldSignature']['isRequired'] extends true
			? K
			: never
		: T['fields'] extends ISchemaFields
		? T['fields'][K] extends FieldDefinition
			? T['fields'][K]['isRequired'] extends true
				? K
				: never
			: never
		: never
}[SchemaFieldNames<T>]

/** Gets you all field names that have a default value set */
export type SchemaFieldNamesWithDefaultValue<T extends ISchema> = {
	[K in SchemaFieldNames<
		T
	>]: T['dynamicFieldSignature'] extends DynamicFieldSignature
		? T['dynamicFieldSignature']['defaultValue'] extends Required<
				T['dynamicFieldSignature']['defaultValue']
		  >
			? K
			: never
		: T['fields'] extends ISchemaFields
		? T['fields'][K] extends FieldDefinition
			? T['fields'][K]['defaultValue'] extends Required<
					T['fields'][K]['defaultValue']
			  >
				? K
				: never
			: never
		: never
}[SchemaFieldNames<T>]

export type SchemaFieldValueType<
	S extends ISchema,
	K extends SchemaFieldNames<S>,
	CreateEntityInstances extends boolean = false
> = S['dynamicFieldSignature'] extends DynamicFieldSignature
	? FieldDefinitionValueType<S['dynamicFieldSignature'], CreateEntityInstances>
	: S['fields'] extends ISchemaFields
	? S['fields'][K] extends FieldDefinition
		? FieldDefinitionValueType<S['fields'][K], CreateEntityInstances>
		: never
	: never

/** A union of all field names */
export type SchemaFieldNames<
	T extends ISchema
> = T['fields'] extends ISchemaFields
	? Extract<keyof T['fields'], string>
	: T['dynamicFieldSignature'] extends DynamicFieldSignature
	? string
	: never

export type SchemaPublicFieldNames<S extends ISchema> = {
	[K in SchemaFieldNames<
		S
	>]: S['dynamicFieldSignature'] extends DynamicFieldSignature
		? S['dynamicFieldSignature']['isPrivate'] extends true
			? never
			: K
		: S['fields'] extends ISchemaFields
		? S['fields'][K] extends FieldDefinition
			? S['fields'][K]['isPrivate'] extends true
				? never
				: K
			: never
		: never
}[SchemaFieldNames<S>]

export type SchemaPublicValues<
	S extends ISchema,
	CreateEntityInstances extends boolean = false,
	K extends SchemaPublicFieldNames<S> = SchemaPublicFieldNames<S>,
	V extends SchemaAllValues<S, CreateEntityInstances> = SchemaAllValues<
		S,
		CreateEntityInstances
	>
> = {
	[F in K]: V[F]
}

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
		[K in SchemaFieldNames<
			S
		>]?: S['dynamicFieldSignature'] extends DynamicFieldSignature
			? Partial<
					IFieldDefinitionMap[S['dynamicFieldSignature']['type']]['options']
			  >
			: S['fields'] extends ISchemaFields
			? S['fields'][K] extends IFieldDefinition
				? Partial<IFieldDefinitionMap[S['fields'][K]['type']]['options']>
				: never
			: never
	}
}

/** Options for schema.getValues */
export type ISchemaGetValuesOptions<
	T extends ISchema,
	F extends SchemaFieldNames<T>,
	PF extends SchemaPublicFieldNames<T>,
	CreateEntityInstances extends boolean,
	IncludePrivateFields extends boolean
> = ISchemaNormalizeOptions<T, CreateEntityInstances> &
	(IncludePrivateFields extends false
		? {
				includePrivateFields: IncludePrivateFields
				fields?: PF[]
		  }
		: {
				includePrivateFields?: IncludePrivateFields
				fields?: F[]
		  })
/** Options for schema.getDefaultValues */
export interface ISchemaGetDefaultValuesOptions<
	T extends ISchema,
	F extends SchemaFieldNamesWithDefaultValue<T>,
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
