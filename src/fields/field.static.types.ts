// This is the static compliment to #spruce/schemas/fields/fields.types
// The rule is, if it's not going to be overwritten by a generator, put it in #spruce
import {
	ISchemaDefinition,
	SchemaDefinitionValues,
	ISchema
} from 'schema.types'
import {
	FieldDefinition,
	IFieldValueTypeGeneratorMap
} from '#spruce/schemas/fields/fields.types'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { IInvalidFieldError } from '../errors/error.types'
import {
	IDefinitionsById,
	Unpack,
	IsArrayNoUnpack,
	IsArray,
	IsRequired
} from '../types/utilities.types'
import { ISchemaFieldDefinition } from './SchemaField.types'

export interface IFieldDefinitionToSchemaDefinitionOptions {
	/** All definitions we're validating against */
	definitionsById?: IDefinitionsById
}

export type SchemaFieldUnion<
	S extends Array<ISchemaDefinition>,
	CreateSchemaInstances extends boolean = false
> = {
	[K in keyof S]: S[K] extends ISchemaDefinition
		? CreateSchemaInstances extends true
			? ISchema<S[K]>
			: {
					schemaId: S[K]['id']
					version?: S[K]['version']
					values: SchemaDefinitionValues<S[K]>
			  }
		: any
}

export type ToValueTypeOptions<
	F extends FieldDefinition,
	CreateSchemaInstances extends boolean = true
> = {
	/** All definitions by id for lookups by fields */
	definitionsById?: IDefinitionsById
	/** Create and return a new Schema()  */
	createSchemaInstances?: CreateSchemaInstances
} & Partial<F['options']>

/** Options passed to validate() */
export type ValidateOptions<F extends FieldDefinition> = {
	/** All definitions we're validating against */
	definitionsById?: IDefinitionsById
} & Partial<F['options']>

// if it's not going to change, put it in here
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
			defaultValue?: DefaultArrayValue | null
			/** The current value for this field */
			value?: ArrayValue | null
	  }
	| {
			/** * If this value is NOT an array */
			isArray?: false | undefined
			/** The default value for this if no value is set */
			defaultValue?: DefaultValue | null
			/** The current value for this field */
			value?: Value | null
	  }
)

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

export type FieldDefinitionValueType<
	F extends FieldDefinition,
	CreateSchemaInstances extends boolean = false
> = F extends FieldDefinition
	? IsRequired<
			IsArray<
				NonNullable<
					IFieldValueTypeGeneratorMap<F, CreateSchemaInstances>[F['type']]
				>,
				F['isArray']
			>,
			F['isRequired']
	  >
	: any

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
	validate(value: any, options?: ValidateOptions<F>): IInvalidFieldError[]
	/** Transform any value to the value type of this field. should take anything and return a valid value or blow up. Will never receive undefined */
	toValueType<CreateSchemaInstances extends boolean>(
		value: any,
		options?: ToValueTypeOptions<F, CreateSchemaInstances>
	): Unpack<
		Exclude<
			FieldDefinitionValueType<F, CreateSchemaInstances>,
			undefined | null
		>
	>
}

export type FieldSubclass<F extends FieldDefinition> = new (
	name: string,
	definition: F
) => IField<F>
