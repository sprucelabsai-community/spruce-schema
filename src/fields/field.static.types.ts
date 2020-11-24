import {
	FieldDefinitions,
	IFieldMap,
	IFieldValueTypeGeneratorMap,
} from '#spruce/schemas/fields/fields.types'
import { InvalidFieldError } from '../errors/error.types'
import {
	Schema,
	SchemaValues,
	StaticSchemaEntity,
} from '../schemas.static.types'
import { Unpack, IsArray, IsRequired } from '../types/utilities.types'

export interface ISchemasById {
	[id: string]: Schema[]
}

export type SchemaFieldUnion<
	S extends Array<Schema>,
	CreateEntityInstances extends boolean = false
> = {
	[K in keyof S]: S[K] extends Schema
		? CreateEntityInstances extends true
			? StaticSchemaEntity<S[K]>
			: {
					schemaId: S[K]['id']
					version?: S[K]['version']
					values: SchemaValues<S[K]>
			  }
		: any
}

export interface FieldDefinitionToSchemaOptions {
	/** All definitions we're validating against */
	schemasById?: ISchemasById
}

export type ToValueTypeOptions<
	F extends FieldDefinitions,
	CreateEntityInstances extends boolean = true
> = {
	schemasById?: ISchemasById
	createEntityInstances?: CreateEntityInstances
} & Partial<F['options']>

/** Options passed to validate() */
export type ValidateOptions<F extends FieldDefinitions> = {
	/** All schemas we're validating against */
	schemasById?: ISchemasById
} & Partial<F['options']>

export type FieldType = keyof IFieldMap

// if it's not going to change, put it in here
export type FieldDefinition<
	Value = any,
	DefaultValue = Partial<Value>,
	ArrayValue = Value[],
	DefaultArrayValue = Partial<Value>[]
> = {
	type: FieldType
	/** Default options are empty */
	// eslint-disable-next-line @typescript-eslint/ban-types
	options?: {}
	isPrivate?: boolean
	label?: string
	hint?: string
	isRequired?: boolean
} & (
	| {
			isArray: true
			defaultValue?: DefaultArrayValue | null
			value?: ArrayValue | null
	  }
	| {
			isArray?: false | undefined
			defaultValue?: DefaultValue | null
			value?: Value | null
	  }
)

export type FieldDefinitionValueType<
	F extends FieldDefinitions,
	CreateEntityInstances extends boolean = false
> = F extends FieldDefinitions
	? IsRequired<
			IsArray<
				NonNullable<
					IFieldValueTypeGeneratorMap<F, CreateEntityInstances>[F['type']]
				>,
				F['isArray']
			>,
			F['isRequired']
	  >
	: any

export interface IField<F extends FieldDefinitions> {
	readonly definition: F
	readonly type: F['type']
	readonly options: F['options']
	readonly isRequired: F['isRequired']
	readonly isPrivate: F['isPrivate']
	readonly isArray: F['isArray']
	readonly label: F['label']
	readonly hint: F['hint']
	readonly name: string
	validate(value: any, options?: ValidateOptions<F>): InvalidFieldError[]
	toValueType<CreateEntityInstances extends boolean>(
		value: any,
		options?: ToValueTypeOptions<F, CreateEntityInstances>
	): Unpack<
		Exclude<
			FieldDefinitionValueType<F, CreateEntityInstances>,
			undefined | null
		>
	>
}

export type FieldSubclass<F extends FieldDefinitions> = new (
	name: string,
	definition: F
) => IField<F>
