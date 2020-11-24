import {
	SchemaIdWithVersion,
	SchemaFieldValueUnion,
	Schema,
	StaticSchemaEntity,
	SchemaValues,
} from '../schemas.static.types'
import { IsArrayNoUnpack, IsArray } from '../types/utilities.types'
import { FieldDefinition } from './field.static.types'

export interface ISchemaFieldOptions {
	/** The id of the schema you are relating to */
	schemaId?: SchemaIdWithVersion
	/** The actual schema */
	schema?: Schema
	/** If this needs to be a union of ids */
	schemaIds?: SchemaIdWithVersion[]
	/** Actual schemas if more that one, this will make a union */
	schemas?: Schema[]
	/** Set a callback to return schema definitions (Do not use if you plan on sharing your definitions) */
	schemasCallback?: () => Schema[]
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

export type SchemaFieldValueTypeMapper<
	F extends ISchemaFieldDefinition,
	CreateEntityInstances extends boolean = false
> = F['options']['schemas'] extends Array<Schema>
	? IsArrayNoUnpack<
			SchemaFieldUnion<F['options']['schemas'], CreateEntityInstances>[number],
			F['isArray']
	  >
	: F['options']['schema'] extends Schema
	? CreateEntityInstances extends true
		? IsArray<StaticSchemaEntity<F['options']['schema']>, F['isArray']>
		: IsArray<SchemaValues<F['options']['schema']>, F['isArray']>
	: any

export type ISchemaFieldDefinition = FieldDefinition<
	Record<string, any>,
	Record<string, any>,
	SchemaFieldValueUnion[],
	SchemaFieldValueUnion[]
> & {
	/** * .Schema go team! */
	type: 'schema'
	options: ISchemaFieldOptions
}
