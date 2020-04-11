import { SpruceErrorOptions, ISpruceErrorOptions } from '@sprucelabs/error'
import { FieldType } from '../fields/fieldType'

export enum SchemaErrorCode {
	/** * Schema was not found */
	SchemaNotFound = 'SCHEMA_NOT_FOUND',
	/** * Schema by id already exists */
	DuplicateSchema = 'DUPLICATE_SCHEMA',
	/** * Field failed validation */
	InvalidField = 'INVALID_FIELD',
	/** * When transforming a value fails */
	TransformationFailed = 'TRANSFORMATION_ERROR'
}

export type SchemaErrorOptions =
	| IDuplicateSchemaErrorOptions
	| ISchemaErrorOptionsNotFound
	| IInvalidFieldErrorOptions
	| ITransformationFailedErrorOptions
	| SpruceErrorOptions

export interface ISchemaErrorOptionsNotFound
	extends ISpruceErrorOptions<SchemaErrorCode> {
	/** * Could not find a schema by id */
	code: SchemaErrorCode.SchemaNotFound
	schemaId: string
}

export interface IDuplicateSchemaErrorOptions
	extends ISpruceErrorOptions<SchemaErrorCode> {
	/** * A schema with this id already exists */
	code: SchemaErrorCode.DuplicateSchema
	schemaId: string
}

export interface IInvalidFieldErrorOptions
	extends ISpruceErrorOptions<SchemaErrorCode> {
	/** * The field did not pass validation */
	code: SchemaErrorCode.InvalidField
	schemaId: string
	errors: { fieldName: string; errors: string[] }[]
}

export interface ITransformationFailedErrorOptions
	extends ISpruceErrorOptions<SchemaErrorCode> {
	/** * The field could not transform the value */
	code: SchemaErrorCode.TransformationFailed
	/** The type of field trying to do the transformation */
	fieldType: FieldType
	/** The value type */
	incomingTypeof: string
	/** The actual value */
	incomingValue: string
}
