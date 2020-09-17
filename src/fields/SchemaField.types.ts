import {
	ISchemaIdWithVersion,
	ISchemaFieldValueUnion,
	ISchema,
	ISchemaEntity,
	SchemaValues,
} from '../schemas.static.types'
import { IsArrayNoUnpack, IsArray } from '../types/utilities.types'
import { IFieldDefinition } from './field.static.types'

export interface ISchemaFieldOptions {
	/** The id of the schema you are relating to */
	schemaId?: ISchemaIdWithVersion
	/** The actual schema */
	schema?: ISchema
	/** If this needs to be a union of ids */
	schemaIds?: ISchemaIdWithVersion[]
	/** Actual schemas if more that one, this will make a union */
	schemas?: ISchema[]
	/** Set a callback to return schema definitions (Do not use if you plan on sharing your definitions) */
	schemasCallback?: () => ISchema[]
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

export type SchemaFieldValueTypeMapper<
	F extends ISchemaFieldDefinition,
	CreateEntityInstances extends boolean = false
> = F['options']['schemas'] extends Array<ISchema>
	? IsArrayNoUnpack<
			SchemaFieldUnion<F['options']['schemas'], CreateEntityInstances>[number],
			F['isArray']
	  >
	: F['options']['schema'] extends ISchema
	? CreateEntityInstances extends true
		? IsArray<ISchemaEntity<F['options']['schema']>, F['isArray']>
		: IsArray<SchemaValues<F['options']['schema']>, F['isArray']>
	: any

export type ISchemaFieldDefinition = IFieldDefinition<
	Record<string, any>,
	Record<string, any>,
	ISchemaFieldValueUnion[],
	ISchemaFieldValueUnion[]
> & {
	/** * .Schema go team! */
	type: 'schema'
	options: ISchemaFieldOptions
}
