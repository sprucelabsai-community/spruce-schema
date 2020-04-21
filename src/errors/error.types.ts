import { SpruceErrorOptions, ISpruceErrorOptions } from '@sprucelabs/error'
import { FieldType } from '#spruce:schema/fields/fieldType'

export enum SchemaErrorCode {
	/** * Schema was not found */
	SchemaNotFound = 'SCHEMA_NOT_FOUND',
	/** * Schema by id already exists */
	DuplicateSchema = 'DUPLICATE_SCHEMA',
	/** * Field failed validation */
	InvalidField = 'INVALID_FIELD',
	/** * When transforming a value fails */
	TransformationFailed = 'TRANSFORMATION_ERROR',
	/** * When a definition is not value */
	InvalidSchemaDefinition = 'INVALID_SCHEMA_DEFINITION',
	/** * When something is not implemented */
	NotImplemented = 'NOT_IMPLEMENTED'
}

export type SchemaErrorOptions =
	| IDuplicateSchemaErrorOptions
	| ISchemaErrorOptionsNotFound
	| IInvalidFieldErrorOptions
	| ITransformationFailedErrorOptions
	| IInvalidSchemaDefinitionErrorOptions
	| INotImplementedErrorOptions
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

export interface IInvalidSchemaDefinitionErrorOptions
	extends ISpruceErrorOptions<SchemaErrorCode> {
	/** * The field could not transform the value */
	code: SchemaErrorCode.InvalidSchemaDefinition
	/** The id of the schema */
	schemaId: string
	/** All the errors in the definition */
	errors: string[]
}

export interface INotImplementedErrorOptions
	extends ISpruceErrorOptions<SchemaErrorCode> {
	/** * The field could not transform the value */
	code: SchemaErrorCode.NotImplemented
	/** What someone is to do based on something to being implemented */
	instructions: string
}
