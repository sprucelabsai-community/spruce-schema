import { SpruceErrorOptions, ISpruceErrorOptions } from '@sprucelabs/error'

export enum SchemaErrorCode {
	/** * Schema was not found */
	SchemaNotFound = 'SCHEMA_NOT_FOUND',
	/** * Schema by id already exists */
	DuplicateSchemaId = 'DUPLICATE_SCHEMA_ID',
	/** * Field failed validate() */
	InvalidField = 'INVALID_FIELD'
}

export type SchemaErrorOptions =
	| ISchemaErrorOptionsDuplicate
	| ISchemaErrorOptionsNotFound
	| ISchemaErrorOptionsInvalidField
	| SpruceErrorOptions

export interface ISchemaErrorOptionsNotFound
	extends ISpruceErrorOptions<SchemaErrorCode> {
	/** * Could not find a schema by id */
	code: SchemaErrorCode.SchemaNotFound
	schemaId: string
	additionalDetails?: string
}

export interface ISchemaErrorOptionsDuplicate
	extends ISpruceErrorOptions<SchemaErrorCode> {
	/** * A schema with this id already exists */
	code: SchemaErrorCode.DuplicateSchemaId
	schemaId: string
	additionalDetails?: string
}

export interface ISchemaErrorOptionsInvalidField
	extends ISpruceErrorOptions<SchemaErrorCode> {
	/** * The field did not pass validation */
	code: SchemaErrorCode.InvalidField
	schemaId: string
	errors: { fieldName: string; errors: string[] }[]
}
