import {
	FieldDefinition,
	IFieldMap,
	IFieldValueTypeGeneratorMap,
} from '#spruce/schemas/fields/fields.types'
import { IInvalidFieldError } from '../errors/error.types'
import { ISchema, SchemaValues, ISchemaEntity } from '../schemas.static.types'
import { Unpack, IsArray, IsRequired } from '../types/utilities.types'

export interface ISchemasById {
	[id: string]: ISchema[]
}

export type SchemaFieldUnion<
	S extends Array<ISchema>,
	CreateEntityInstances extends boolean = false
> = {
	[K in keyof S]: S[K] extends ISchema
		? CreateEntityInstances extends true
			? ISchemaEntity<S[K]>
			: {
					schemaId: S[K]['id']
					version?: S[K]['version']
					values: SchemaValues<S[K]>
			  }
		: any
}

export interface IFieldDefinitionToSchemaOptions {
	/** All definitions we're validating against */
	schemasById?: ISchemasById
}

export type ToValueTypeOptions<
	F extends FieldDefinition,
	CreateEntityInstances extends boolean = true
> = {
	schemasById?: ISchemasById
	createEntityInstances?: CreateEntityInstances
} & Partial<F['options']>

/** Options passed to validate() */
export type ValidateOptions<F extends FieldDefinition> = {
	/** All schemas we're validating against */
	schemasById?: ISchemasById
} & Partial<F['options']>

export type FieldType = keyof IFieldMap

// if it's not going to change, put it in here
export type IFieldDefinition<
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
	F extends FieldDefinition,
	CreateEntityInstances extends boolean = false
> = F extends FieldDefinition
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

export interface IField<F extends FieldDefinition> {
	readonly definition: F
	readonly type: F['type']
	readonly options: F['options']
	readonly isRequired: F['isRequired']
	readonly isPrivate: F['isPrivate']
	readonly isArray: F['isArray']
	readonly label: F['label']
	readonly hint: F['hint']
	readonly name: string
	validate(value: any, options?: ValidateOptions<F>): IInvalidFieldError[]
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

export type FieldSubclass<F extends FieldDefinition> = new (
	name: string,
	definition: F
) => IField<F>
