import { SpruceErrorOptions, ISpruceErrorOptions } from '@sprucelabs/error'

export enum SchemaErrorCode {
	NotFound = 'SCHEMA_NOT_FOUND',
	Duplicate = 'DUPLICATE_SCHEMA_ID',
	InvalidField = 'INVALID_FIELD'
}

export type SchemaErrorOptions =
	| ISchemaErrorOptionsDuplicate
	| ISchemaErrorOptionsNotFound
	| ISchemaErrorOptionsInvalidField
	| SpruceErrorOptions

export interface ISchemaErrorOptionsNotFound
	extends ISpruceErrorOptions<SchemaErrorCode> {
	code: SchemaErrorCode.NotFound
	schemaId: string
	additionalDetails?: string
}

export interface ISchemaErrorOptionsDuplicate
	extends ISpruceErrorOptions<SchemaErrorCode> {
	code: SchemaErrorCode.Duplicate
	schemaId: string
	additionalDetails?: string
}

export interface ISchemaErrorOptionsInvalidField
	extends ISpruceErrorOptions<SchemaErrorCode> {
	code: SchemaErrorCode.InvalidField
	schemaId: string
	errors: { fieldName: string; errors: string[] }[]
}
