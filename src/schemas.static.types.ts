import {
	FieldDefinition,
	Field,
	IFieldDefinitionMap,
	IFieldMap,
} from '#spruce/schemas/fields/fields.types'
import {
	IFieldDefinition,
	FieldDefinitionValueType,
	IField,
	FieldType,
} from './fields/field.static.types'

export interface ISchemaEntity<S extends ISchema> {
	readonly schemaId: S['id']
	readonly name: S['name']
	readonly description?: string
	readonly version?: string

	get<
		F extends SchemaFieldNames<S>,
		CreateEntityInstances extends boolean = true
	>(
		fieldName: F,
		options?: ISchemaNormalizeOptions<S, CreateEntityInstances>
	): SchemaFieldValueType<S, F, CreateEntityInstances>

	set<F extends SchemaFieldNames<S>>(
		fieldName: F,
		value: SchemaFieldValueType<S, F>,
		options?: ISchemaNormalizeOptions<S, false>
	): this

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

	setValues(values: SchemaPartialValues<S>): this

	getNamedFields<F extends SchemaFieldNames<S>>(
		options?: ISchemaNamedFieldsOptions<S, F>
	): ISchemaNamedField<S>[]

	validate(options?: ISchemaValidateOptions<S>): void
	isValid(options?: ISchemaValidateOptions<S>): boolean
}

export interface IDynamicSchemaEntity<
	Schema extends ISchema,
	Field extends IField<
		any
	> = Schema['dynamicFieldSignature'] extends FieldDefinition
		? IFieldMap[Schema['dynamicFieldSignature']['type']]
		: any
> extends Omit<
		ISchemaEntity<Schema>,
		'get' | 'set' | 'getValues' | 'setValues' | 'getNamedFields'
	> {
	get<F extends string, CreateEntityInstances extends boolean = true>(
		fieldName: F,
		options?: IDynamicSchemaNormalizeOptions<CreateEntityInstances>
	): FieldDefinitionValueType<Field, CreateEntityInstances>

	set<F extends string>(
		fieldName: F,
		value: FieldDefinitionValueType<Field>,
		options?: IDynamicSchemaNormalizeOptions<false>
	): this

	getValues<F extends string, CreateEntityInstances extends boolean = true>(
		options?: IDynamicSchemaGetValuesOptions<Schema, F, CreateEntityInstances>
	): DynamicSchemaAllValues<Schema, CreateEntityInstances>

	setValues(values: DynamicSchemaPartialValues<Schema>): this
	getNamedFields<F extends string>(
		options?: IDynamicSchemaNamedFieldsOptions<F>
	): IDynamicSchemaNamedField[]

	validate(options?: IDynamicSchemaValidateOptions): void
	isValid(options?: IDynamicSchemaValidateOptions): boolean
}

export interface ISchemaFields {
	[fieldName: string]: FieldDefinition
}

/** A schema defines the data structure of something */
export interface ISchema {
	id: string
	name?: string
	version?: string
	description?: string
	dynamicFieldSignature?: FieldDefinition & {
		keyName: string
		keyTypeLiteral?: string
	}
	fields?: ISchemaFields
}

export interface ISchemaFieldValueUnion<
	V extends Record<string, any> = Record<string, any>
> {
	schemaId: string
	version?: string
	values: V
}

export type SchemaFields<T extends ISchema> = {
	[F in SchemaFieldNames<T>]: T['fields'][F] extends IFieldDefinition
		? IFieldMap[T['fields'][F]['type']]
		: never
}

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

export type DynamicSchemaAllValues<
	S extends ISchema,
	CreateEntityInstances extends boolean = false
> = {
	[dynamicKey: string]: S['dynamicFieldSignature'] extends FieldDefinition
		? FieldDefinitionValueType<
				S['dynamicFieldSignature'],
				CreateEntityInstances
		  >
		: never
}

export type SchemaPartialValues<
	T extends ISchema,
	CreateEntityInstances extends boolean = false
> = {
	[K in SchemaFieldNames<T>]?:
		| SchemaFieldValueType<T, K, CreateEntityInstances>
		| undefined
		| null
}

export type DynamicSchemaPartialValues<
	S extends ISchema,
	CreateEntityInstances extends boolean = false
> = Partial<{
	[dynamicField: string]: S['dynamicFieldSignature'] extends FieldDefinition
		?
				| FieldDefinitionValueType<
						S['dynamicFieldSignature'],
						CreateEntityInstances
				  >
				| undefined
				| null
		: never
}>

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

export type SchemaOptionalFieldNames<T extends ISchema> = {
	[K in SchemaFieldNames<T>]: T['fields'][K] extends FieldDefinition
		? T['fields'][K]['isRequired'] extends true
			? never
			: K
		: never
}[SchemaFieldNames<T>]

export type SchemaRequiredFieldNames<T extends ISchema> = {
	[K in SchemaFieldNames<T>]: T['fields'][K] extends FieldDefinition
		? T['fields'][K]['isRequired'] extends true
			? K
			: never
		: never
}[SchemaFieldNames<T>]

export type SchemaFieldNamesWithDefaultValue<T extends ISchema> = {
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

export type SchemaFieldNames<T extends ISchema> = Extract<
	keyof T['fields'],
	string
>

export type SchemaPublicFieldNames<S extends ISchema> = {
	[K in SchemaFieldNames<S>]: S['fields'][K] extends FieldDefinition
		? S['fields'][K]['isPrivate'] extends true
			? never
			: K
		: never
}[SchemaFieldNames<S>]

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

export type SchemaFieldDefinition<
	T extends ISchema,
	K extends SchemaFieldNames<T>
> = T['fields'][K] extends FieldDefinition ? T['fields'][K]['type'] : never

export type SchemaFieldType<
	T extends ISchema,
	K extends SchemaFieldNames<T>
> = T['fields'][K] extends FieldDefinition ? T['fields'][K]['type'] : never

export interface ISchemaNamedField<T extends ISchema> {
	name: SchemaFieldNames<T>
	field: Field
}

export interface IDynamicSchemaNamedField {
	name: string
	field: Field
}

export interface ISchemaNormalizeFieldValueOptions<
	CreateEntityInstances extends boolean
> {
	/** Should i validate any values passed through */
	validate?: boolean
	/** Should I create schema instances for schema fields (defaults to true) */
	createEntityInstances?: CreateEntityInstances
}

export interface ISchemaNormalizeOptions<
	S extends ISchema,
	CreateEntityInstances extends boolean
> extends ISchemaNormalizeFieldValueOptions<CreateEntityInstances> {
	/** Options passed to each field that conforms to the field definition's options */
	byField?: {
		[K in SchemaFieldNames<S>]?: S['fields'][K] extends IFieldDefinition
			? Partial<IFieldDefinitionMap[S['fields'][K]['type']]['options']>
			: never
	}
}

export interface IDynamicSchemaNormalizeOptions<
	CreateEntityInstances extends boolean
> extends ISchemaNormalizeFieldValueOptions<CreateEntityInstances> {}

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

export type IDynamicSchemaGetValuesOptions<
	T extends ISchema,
	F extends string,
	CreateEntityInstances extends boolean
> = ISchemaNormalizeOptions<T, CreateEntityInstances> & {
	fields?: F[]
}

export interface ISchemaGetDefaultValuesOptions<
	T extends ISchema,
	F extends SchemaFieldNamesWithDefaultValue<T>,
	CreateEntityInstances extends boolean
> extends ISchemaNormalizeOptions<T, CreateEntityInstances> {
	fields?: F[]
}

export interface ISchemaNamedFieldsOptions<
	T extends ISchema,
	F extends SchemaFieldNames<T>
> {
	fields?: F[]
}

export interface IDynamicSchemaValidateOptions<F extends string = string>
	extends IDynamicSchemaNamedFieldsOptions<F> {}

export interface IDynamicSchemaNamedFieldsOptions<F extends string> {
	fields?: F[]
}

export interface ISchemaValidateOptions<
	T extends ISchema,
	F extends SchemaFieldNames<T> = SchemaFieldNames<T>
> extends ISchemaNamedFieldsOptions<T, F> {}

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
