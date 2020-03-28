import { SpruceErrorOptions, ISpruceErrorOptions } from '@sprucelabs/error'

export enum SchemaErrorCode {
	NotFound = 'SCHEMA_NOT_FOUND',
	Duplicate = 'DUPLICATE_SCHEMA_ID'
}

export type SchemaErrorOptions =
	| ISchemaErrorOptionsDuplicate
	| ISchemaErrorOptionsNotFound
	| SpruceErrorOptions

export interface ISchemaErrorOptionsNotFound
	extends ISpruceErrorOptions<SchemaErrorCode> {
	code: SchemaErrorCode.NotFound
	schemaId: string
	notes?: string
}

export interface ISchemaErrorOptionsDuplicate
	extends ISpruceErrorOptions<SchemaErrorCode> {
	code: SchemaErrorCode.Duplicate
	schemaId: string
	notes?: string
}
