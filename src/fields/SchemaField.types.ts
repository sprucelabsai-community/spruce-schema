import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import {
	ISchemaIdWithVersion,
	ISchemaFieldDefinitionValueUnion,
	ISchemaDefinition,
	ISchema,
	SchemaDefinitionValues
} from '../schema.types'
import { IsArrayNoUnpack, IsArray } from '../types/utilities.types'
import { IFieldDefinition } from './field.static.types'

export interface ISchemaFieldOptions {
	/** The id of the schema you are relating to */
	schemaId?: ISchemaIdWithVersion
	/** The actual schema */
	schema?: ISchemaDefinition
	/** If this needs to be a union of ids */
	schemaIds?: ISchemaIdWithVersion[]
	/** Actual schemas if more that one, this will make a union */
	schemas?: ISchemaDefinition[]
	/** Set a callback to return schema definitions (Do not use if you plan on sharing your definitions) */
	schemasCallback?: () => ISchemaDefinition[]
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

export type SchemaFieldValueTypeGenerator<
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

export type ISchemaFieldDefinition = IFieldDefinition<
	Record<string, any>,
	Record<string, any>,
	ISchemaFieldDefinitionValueUnion[],
	ISchemaFieldDefinitionValueUnion[]
> & {
	/** * .Schema go team! */
	type: FieldType.Schema
	options: ISchemaFieldOptions
}
