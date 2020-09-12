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
		F extends SchemaStaticFieldNames<S> = SchemaStaticFieldNames<S>,
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
	): S['dynamicFieldSignature'] extends DynamicFieldSignature
		? Record<string, SchemaFieldValueType<S, string>>
		: IncludePrivateFields extends false
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

export type SchemaDynamicValues<
	S extends ISchema,
	CreateSchemaInstances extends boolean = false
> = {
	[keyName: string]: S['dynamicFieldSignature'] extends DynamicFieldSignature
		? FieldDefinitionValueType<
				S['dynamicFieldSignature'],
				CreateSchemaInstances
		  >
		: never
}

export type SchemaPartialValues<
	S extends ISchema,
	CreateEntityInstances extends boolean = false
> = Partial<SchemaValues<S, CreateEntityInstances>>

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
	[F in SchemaStaticFieldNames<T>]: T['fields'][F] extends IFieldDefinition
		? IFieldMap[T['fields'][F]['type']]
		: never
}

export type SchemaAllValues<
	S extends ISchema,
	CreateEntityInstances extends boolean = false
> = {
	[K in SchemaStaticFieldNames<S>]-?: SchemaStaticFieldValueType<
		S,
		K,
		CreateEntityInstances
	>
}

export type SchemaStaticFieldsPartialValues<
	T extends ISchema,
	CreateEntityInstances extends boolean = false
> = {
	[K in SchemaStaticFieldNames<T>]?:
		| SchemaStaticFieldValueType<T, K, CreateEntityInstances>
		| undefined
		| null
}

export type SchemaValues<
	T extends ISchema,
	CreateEntityInstances extends boolean = false,
	K extends SchemaOptionalFieldNames<T> = SchemaOptionalFieldNames<T>,
	V extends SchemaAllValues<T, CreateEntityInstances> = SchemaAllValues<
		T,
		CreateEntityInstances
	>
> = T['dynamicFieldSignature'] extends DynamicFieldSignature
	? Record<
			string,
			FieldDefinitionValueType<
				T['dynamicFieldSignature'],
				CreateEntityInstances
			>
	  >
	: SchemaStaticFieldValues<T, CreateEntityInstances, K, V>

export type SchemaStaticFieldValues<
	T extends ISchema,
	CreateEntityInstances extends boolean = false,
	K extends SchemaOptionalFieldNames<T> = SchemaOptionalFieldNames<T>,
	V extends SchemaAllValues<T, CreateEntityInstances> = SchemaAllValues<
		T,
		CreateEntityInstances
	>
> = Omit<V, K> & Partial<Pick<V, K>>

/** Only the default values of a definition */
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
	[K in SchemaStaticFieldNames<T>]: T['fields'][K] extends FieldDefinition
		? T['fields'][K]['isRequired'] extends true
			? never
			: K
		: never
}[SchemaStaticFieldNames<T>]

/** All fields that are required on the schema */
export type SchemaRequiredFieldNames<T extends ISchema> = {
	[K in SchemaStaticFieldNames<T>]: T['fields'][K] extends FieldDefinition
		? T['fields'][K]['isRequired'] extends true
			? K
			: never
		: never
}[SchemaStaticFieldNames<T>]

/** Gets you all field names that have a default value set */
export type SchemaFieldNamesWithDefaultValue<T extends ISchema> = {
	[K in SchemaStaticFieldNames<T>]: T['fields'][K] extends FieldDefinition
		? T['fields'][K]['defaultValue'] extends Required<
				T['fields'][K]['defaultValue']
		  >
			? K
			: never
		: never
}[SchemaStaticFieldNames<T>]

export type SchemaStaticFieldValueType<
	S extends ISchema,
	K extends SchemaStaticFieldNames<S>,
	CreateEntityInstances extends boolean = false
> = S['fields'][K] extends FieldDefinition
	? FieldDefinitionValueType<S['fields'][K], CreateEntityInstances>
	: never

export type SchemaFieldValueType<
	S extends ISchema,
	K extends SchemaStaticFieldNames<S> | string,
	CreateEntityInstances extends boolean = false
> = S['dynamicFieldSignature'] extends DynamicFieldSignature
	? FieldDefinitionValueType<S['dynamicFieldSignature'], CreateEntityInstances>
	: K extends SchemaStaticFieldNames<S>
	? SchemaStaticFieldValueType<S, K, CreateEntityInstances>
	: never

/** A union of all field names */
export type SchemaStaticFieldNames<T extends ISchema> = Extract<
	keyof T['fields'],
	string
>

export type SchemaFieldNames<
	T extends ISchema
> = T['dynamicFieldSignature'] extends DynamicFieldSignature
	? string
	: Extract<keyof T['fields'], string>

export type SchemaPublicFieldNames<S extends ISchema> = {
	[K in SchemaStaticFieldNames<S>]: S['fields'][K] extends FieldDefinition
		? S['fields'][K]['isPrivate'] extends true
			? never
			: K
		: never
}[SchemaStaticFieldNames<S>]

export type SchemaPublicValues<
	S extends ISchema,
	CreateEntityInstances extends boolean = false,
	PublicFieldNames extends SchemaPublicFieldNames<S> = SchemaPublicFieldNames<
		S
	>,
	AllValues extends SchemaValues<S, CreateEntityInstances> = SchemaValues<
		S,
		CreateEntityInstances
	>
> = S['fields'] extends ISchemaFields
	? Exclude<Pick<AllValues, PublicFieldNames>, never>
	: never

/** Pluck out the field definition from the schema */
export type SchemaFieldDefinition<
	T extends ISchema,
	K extends SchemaStaticFieldNames<T>
> = T['fields'][K] extends FieldDefinition ? T['fields'][K]['type'] : never

/** Get the field type for a field from a schema */
export type SchemaFieldType<
	T extends ISchema,
	K extends SchemaStaticFieldNames<T>
> = T['fields'][K] extends FieldDefinition ? T['fields'][K]['type'] : never

/** Response to getNamedFields */
export interface ISchemaStaticNamedField<T extends ISchema> {
	name: SchemaStaticFieldNames<T>
	field: Field
}

export type SchemaNamedField<
	T extends ISchema
> = T['dynamicFieldSignature'] extends DynamicFieldSignature
	? { name: string; field: Field }
	: ISchemaStaticNamedField<T>

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
		[K in SchemaStaticFieldNames<S>]?: S['fields'][K] extends IFieldDefinition
			? Partial<IFieldDefinitionMap[S['fields'][K]['type']]['options']>
			: never
	}
}

/** Options for schema.getValues */
export type ISchemaGetValuesOptions<
	T extends ISchema,
	F extends SchemaStaticFieldNames<T>,
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
	F extends SchemaStaticFieldNames<T>
> {
	fields?: F[]
}

/** Options for schema.validate */
export interface ISchemaValidateOptions<
	T extends ISchema,
	F extends SchemaStaticFieldNames<T> = SchemaStaticFieldNames<T>
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
