import {
	FieldDefinitions,
	Fields,
	FieldDefinitionMap,
	FieldMap,
} from '#spruce/schemas/fields/fields.types'
import {
	FieldDefinition,
	FieldDefinitionValueType,
	Field,
	FieldType,
} from './fields/field.static.types'

export interface SchemaEntity {
	schemaId: string
	namespace?: string
	name?: string
	version?: string
	description?: string
	get(fieldName: string, options?: Record<string, any>): any
	set(fieldName: string, value: any, options?: Record<string, any>): this
	getValues(options?: Record<string, any>): Record<string, any>
	setValues(values: Record<string, any>): this
	getNamedFields(options?: Record<string, any>): SchemaNamedField<any>[]
	validate(options?: Record<string, any>): void
	isValid(options?: Record<string, any>): boolean
}

export interface StaticSchemaEntity<S extends Schema> extends SchemaEntity {
	readonly schemaId: S['id']
	readonly name: S['name']
	readonly namespace: S['namespace']
	readonly description?: string
	readonly version?: string

	get<
		F extends SchemaFieldNames<S>,
		CreateEntityInstances extends boolean = true
	>(
		fieldName: F,
		options?: SchemaNormalizeOptions<S, CreateEntityInstances>
	): SchemaFieldValueType<S, F, CreateEntityInstances>

	set<F extends SchemaFieldNames<S>>(
		fieldName: F,
		value: SchemaFieldValueType<S, F>,
		options?: SchemaNormalizeOptions<S, false>
	): this

	getValues<
		F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
		PF extends SchemaPublicFieldNames<S> = SchemaPublicFieldNames<S>,
		CreateEntityInstances extends boolean = true,
		IncludePrivateFields extends boolean = true
	>(
		options?: SchemaGetValuesOptions<
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
		options?: SchemaNamedFieldsOptions<S, F>
	): SchemaNamedField<S>[]

	validate(options?: SchemaValidateOptions<S>): void
	isValid(options?: SchemaValidateOptions<S>): boolean
}

export interface DynamicSchemaEntityByName<
	ISchema extends Schema,
	OurField extends Field<any> = ISchema['dynamicFieldSignature'] extends FieldDefinitions
		? FieldMap[ISchema['dynamicFieldSignature']['type']]
		: any
> extends SchemaEntity,
		Omit<
			StaticSchemaEntity<ISchema>,
			| 'get'
			| 'set'
			| 'getValues'
			| 'setValues'
			| 'getNamedFields'
			| 'schemaId'
			| 'namespace'
			| 'name'
			| 'version'
			| 'description'
		> {
	get<F extends string, CreateEntityInstances extends boolean = true>(
		fieldName: F,
		options?: DynamicSchemaNormalizeOptions<CreateEntityInstances>
	): FieldDefinitionValueType<OurField, CreateEntityInstances>

	set<F extends string>(
		fieldName: F,
		value: FieldDefinitionValueType<OurField>,
		options?: DynamicSchemaNormalizeOptions<false>
	): this

	getValues<F extends string, CreateEntityInstances extends boolean = true>(
		options?: DynamicSchemaGetValuesOptions<ISchema, F, CreateEntityInstances>
	): DynamicSchemaAllValues<ISchema, CreateEntityInstances>

	setValues(values: DynamicSchemaPartialValues<ISchema>): this
	getNamedFields<F extends string>(
		options?: DynamicSchemaNamedFieldsOptions<F>
	): DynamicSchemaNamedField[]

	validate(options?: DynamicSchemaValidateOptions): void
	isValid(options?: DynamicSchemaValidateOptions): boolean
}

export interface SchemaFieldsByName {
	[fieldName: string]: FieldDefinitions
}

export interface Schema {
	id: string
	name?: string
	version?: string
	namespace?: string
	description?: string
	importsWhenLocal?: string[]
	importsWhenRemote?: string[]
	typeSuffix?: string
	dynamicFieldSignature?: FieldDefinitions & {
		keyName: string
		keyTypeLiteral?: string
	}
	fields?: SchemaFieldsByName
}

export interface SchemaFieldValueUnion<
	V extends Record<string, any> = Record<string, any>
> {
	schemaId: string
	version?: string
	values: V
}

export type SchemaFields<T extends Schema> = {
	[F in SchemaFieldNames<T>]: T['fields'][F] extends FieldDefinition
		? FieldMap[T['fields'][F]['type']]
		: never
}

export type SchemaAllValues<
	S extends Schema,
	CreateEntityInstances extends boolean = false
> = IsDynamicSchema<S> extends true
	? DynamicSchemaAllValues<S, CreateEntityInstances>
	: StaticSchemaAllValues<S, CreateEntityInstances>

export type StaticSchemaAllValues<
	S extends Schema,
	CreateEntityInstances extends boolean = false
> = {
	[K in SchemaFieldNames<S>]-?: SchemaFieldValueType<
		S,
		K,
		CreateEntityInstances
	>
}

export type DynamicSchemaAllValues<
	S extends Schema,
	CreateEntityInstances extends boolean = false
> = {
	[dynamicKey: string]: S['dynamicFieldSignature'] extends FieldDefinitions
		? FieldDefinitionValueType<
				S['dynamicFieldSignature'],
				CreateEntityInstances
		  >
		: never
}

export type SchemaPartialValues<
	S extends Schema,
	CreateEntityInstances extends boolean = false
> = IsDynamicSchema<S> extends true
	? DynamicSchemaPartialValues<S, CreateEntityInstances>
	: StaticSchemaPartialValues<S, CreateEntityInstances>

export type StaticSchemaPartialValues<
	T extends Schema,
	CreateEntityInstances extends boolean = false
> = {
	[K in SchemaFieldNames<T>]?:
		| SchemaFieldValueType<T, K, CreateEntityInstances>
		| undefined
		| null
}

export type DynamicSchemaPartialValues<
	S extends Schema,
	CreateEntityInstances extends boolean = false
> = Partial<{
	[dynamicField: string]: S['dynamicFieldSignature'] extends FieldDefinitions
		?
				| FieldDefinitionValueType<
						S['dynamicFieldSignature'],
						CreateEntityInstances
				  >
				| undefined
				| null
		: never
}>

export type SchemaStaticValues<
	T extends Schema,
	CreateEntityInstances extends boolean = false,
	K extends SchemaOptionalFieldNames<T> = SchemaOptionalFieldNames<T>,
	V extends SchemaAllValues<T, CreateEntityInstances> = SchemaAllValues<
		T,
		CreateEntityInstances
	>
> = Omit<V, K> & Partial<Pick<V, K>>

export type SchemaValues<
	S extends Schema,
	CreateEntityInstances extends boolean = false
> = IsDynamicSchema<S> extends true
	? DynamicSchemaAllValues<S>
	: SchemaStaticValues<S, CreateEntityInstances>

export type IsDynamicSchema<
	S extends Schema
> = S['dynamicFieldSignature'] extends FieldDefinitions ? true : false

export type SchemaDefaultValues<
	S extends Schema,
	CreateEntityInstances extends boolean = false,
	K extends SchemaFieldNamesWithDefaultValue<S> = SchemaFieldNamesWithDefaultValue<S>,
	V extends SchemaAllValues<S, CreateEntityInstances> = SchemaAllValues<
		S,
		CreateEntityInstances
	>
> = {
	[F in K]: NonNullable<V[F]>
}

export type SchemaValuesWithDefaults<T extends Schema> = SchemaValues<T> &
	SchemaDefaultValues<T>

export type SchemaOptionalFieldNames<T extends Schema> = {
	[K in SchemaFieldNames<T>]: T['fields'][K] extends FieldDefinitions
		? T['fields'][K]['isRequired'] extends true
			? never
			: K
		: never
}[SchemaFieldNames<T>]

export type SchemaRequiredFieldNames<T extends Schema> = {
	[K in SchemaFieldNames<T>]: T['fields'][K] extends FieldDefinitions
		? T['fields'][K]['isRequired'] extends true
			? K
			: never
		: never
}[SchemaFieldNames<T>]

export type SchemaFieldNamesWithDefaultValue<T extends Schema> = {
	[K in SchemaFieldNames<T>]: T['fields'][K] extends FieldDefinitions
		? T['fields'][K]['defaultValue'] extends Required<
				T['fields'][K]['defaultValue']
		  >
			? K
			: never
		: never
}[SchemaFieldNames<T>]

export type SchemaFieldValueType<
	S extends Schema,
	K extends SchemaFieldNames<S>,
	CreateEntityInstances extends boolean = false
> = S['fields'][K] extends FieldDefinitions
	? FieldDefinitionValueType<S['fields'][K], CreateEntityInstances>
	: never

export type SchemaFieldNames<T extends Schema> = Extract<
	keyof T['fields'],
	string
>

export type SchemaPublicFieldNames<S extends Schema> = {
	[K in SchemaFieldNames<S>]: S['fields'][K] extends FieldDefinitions
		? S['fields'][K]['isPrivate'] extends true
			? never
			: K
		: never
}[SchemaFieldNames<S>]

export type SchemaPublicValues<
	S extends Schema,
	CreateEntityInstances extends boolean = false,
	PublicFieldNames extends SchemaPublicFieldNames<S> = SchemaPublicFieldNames<S>,
	AllValues extends SchemaValues<S, CreateEntityInstances> = SchemaValues<
		S,
		CreateEntityInstances
	>
> = S['fields'] extends SchemaFieldsByName
	? Exclude<Pick<AllValues, PublicFieldNames>, never>
	: never

export type SchemaFieldDefinition<
	T extends Schema,
	K extends SchemaFieldNames<T>
> = T['fields'][K] extends FieldDefinitions ? T['fields'][K]['type'] : never

export type SchemaFieldType<
	T extends Schema,
	K extends SchemaFieldNames<T>
> = T['fields'][K] extends FieldDefinitions ? T['fields'][K]['type'] : never

export interface SchemaNamedField<T extends Schema> {
	name: SchemaFieldNames<T>
	field: Fields
}

export interface DynamicSchemaNamedField {
	name: string
	field: Fields
}

export interface SchemaNormalizeFieldValueOptions<
	CreateEntityInstances extends boolean
> {
	/** Should i validate any values passed through */
	validate?: boolean
	/** Should I create schema instances for schema fields (defaults to true) */
	createEntityInstances?: CreateEntityInstances
}

export interface SchemaNormalizeOptions<
	S extends Schema,
	CreateEntityInstances extends boolean
> extends SchemaNormalizeFieldValueOptions<CreateEntityInstances> {
	/** Options passed to each field that conforms to the field definition's options */
	byField?: {
		[K in SchemaFieldNames<S>]?: S['fields'][K] extends FieldDefinition
			? Partial<FieldDefinitionMap[S['fields'][K]['type']]['options']>
			: never
	}
}

export interface DynamicSchemaNormalizeOptions<
	CreateEntityInstances extends boolean
> extends SchemaNormalizeFieldValueOptions<CreateEntityInstances> {}

export type SchemaGetValuesOptions<
	T extends Schema,
	F extends SchemaFieldNames<T>,
	PF extends SchemaPublicFieldNames<T>,
	CreateEntityInstances extends boolean,
	IncludePrivateFields extends boolean
> = SchemaNormalizeOptions<T, CreateEntityInstances> &
	(IncludePrivateFields extends false
		? {
				includePrivateFields: IncludePrivateFields
				fields?: PF[]
		  }
		: {
				includePrivateFields?: IncludePrivateFields
				fields?: F[]
		  })

export type DynamicSchemaGetValuesOptions<
	T extends Schema,
	F extends string,
	CreateEntityInstances extends boolean
> = SchemaNormalizeOptions<T, CreateEntityInstances> & {
	fields?: F[]
}

export interface SchemaGetDefaultValuesOptions<
	T extends Schema,
	F extends SchemaFieldNamesWithDefaultValue<T>,
	CreateEntityInstances extends boolean
> extends SchemaNormalizeOptions<T, CreateEntityInstances> {
	fields?: F[]
}

export interface SchemaNamedFieldsOptions<
	T extends Schema,
	F extends SchemaFieldNames<T>
> {
	fields?: F[]
}

export interface DynamicSchemaValidateOptions<F extends string = string>
	extends DynamicSchemaNamedFieldsOptions<F> {}

export interface DynamicSchemaNamedFieldsOptions<F extends string> {
	fields?: F[]
}

export interface SchemaValidateOptions<
	T extends Schema,
	F extends SchemaFieldNames<T> = SchemaFieldNames<T>
> extends SchemaNamedFieldsOptions<T, F> {}

export type PickFieldNames<S extends Schema, T extends FieldType> = {
	[F in keyof S['fields']]: S['fields'][F] extends FieldDefinitions
		? S['fields'][F]['type'] extends T
			? F
			: never
		: never
}[Extract<keyof S['fields'], string>]

export interface SchemaIdWithVersion {
	id: string
	version?: string
	namespace?: string
}
