// This is the static compliment to #spruce/schemas/fields/fields.types
import {
	FieldDefinition,
	IFieldValueTypeGeneratorMap,
} from '#spruce/schemas/fields/fields.types'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
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
	/** All definitions by id for lookups by fields */
	schemasById?: ISchemasById
	/** Create and return a new SchemaEntity()  */
	createEntityInstances?: CreateEntityInstances
} & Partial<F['options']>

/** Options passed to validate() */
export type ValidateOptions<F extends FieldDefinition> = {
	/** All schemas we're validating against */
	schemasById?: ISchemasById
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
	// eslint-disable-next-line @typescript-eslint/ban-types
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
