import { SpruceErrorOptions, ISpruceErrorOptions } from '@sprucelabs/error'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'

export enum ErrorCode {
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
	NotImplemented = 'NOT_IMPLEMENTED',
	/** * Invalid field options */
	InvalidFieldOptions = 'INVALID_FIELD_OPTIONS',
	/** * A field was registered that was not valid */
	InvalidFieldRegistration = 'INVALID_FIELD_REGISTRATION',
	/** * Something missed on matching a version. */
	VersionNotFound = 'VERSION_NOT_FOUND',
}

export type SchemaErrorOptions =
	| IDuplicateSchemaErrorOptions
	| ISchemaErrorOptionsNotFound
	| IInvalidFieldErrorOptions
	| ITransformationFailedErrorOptions
	| IInvalidSchemaDefinitionErrorOptions
	| INotImplementedErrorOptions
	| IInvalidFieldOptionsErrorOptions
	| IInvalidFieldRegistrationErrorOptions
	| IVersionRequiredErrorOptions
	| SpruceErrorOptions

export interface ISchemaErrorOptionsNotFound
	extends ISpruceErrorOptions<ErrorCode> {
	/** * Could not find a schema by id */
	code: ErrorCode.SchemaNotFound
	schemaId: string
	version?: string
}

export interface IDuplicateSchemaErrorOptions
	extends ISpruceErrorOptions<ErrorCode> {
	/** * A schema with this id already exists */
	code: ErrorCode.DuplicateSchema
	schemaId: string
	version?: string
}
export interface IInvalidFieldError {
	code: string
	error?: Error
	friendlyMessage?: string
	name: string
}
export interface IInvalidFieldErrorOptions
	extends ISpruceErrorOptions<ErrorCode> {
	/** * The field did not pass validation */
	code: ErrorCode.InvalidField
	/** The schema associated with this error */
	schemaId: string
	/** Field errors that occurred */
	errors: IInvalidFieldError[]
}

export interface ITransformationFailedErrorOptions
	extends ISpruceErrorOptions<ErrorCode> {
	/** * The field could not transform the value */
	code: ErrorCode.TransformationFailed
	/** The type of field trying to do the transformation */
	fieldType: FieldType
	/** The value type */
	incomingTypeof: string
	/** The actual value */
	incomingValue: string
	/** Any underlying validation errors */
	errors?: IInvalidFieldError[]
	/** The name of the field that failed to transform any values */
	name: string
}

export interface IInvalidSchemaDefinitionErrorOptions
	extends ISpruceErrorOptions<ErrorCode> {
	/** * The field could not transform the value */
	code: ErrorCode.InvalidSchemaDefinition
	/** The id of the schema */
	schemaId: string
	/** All the errors in the definition */
	errors: string[]
}

export interface INotImplementedErrorOptions
	extends ISpruceErrorOptions<ErrorCode> {
	/** * The field could not transform the value */
	code: ErrorCode.NotImplemented
	/** What someone is to do based on something to being implemented */
	instructions: string
}

export interface IInvalidFieldOptionsErrorOptions
	extends ISpruceErrorOptions<ErrorCode> {
	/** * The field could not transform the value */
	code: ErrorCode.InvalidFieldOptions
	/** The schema with the bad options */
	schemaId?: string
	/** The field with the bad options */
	fieldName?: string
	/** The bad options  */
	options: Record<string, any>
}

export interface IInvalidFieldRegistrationErrorOptions
	extends ISpruceErrorOptions<ErrorCode> {
	/** * The field could not transform the value */
	code: ErrorCode.InvalidFieldRegistration
	/** Package that includes the field (used for import) */
	package: string
	/** The name of the class  field  */
	className: string
	/** The type of the field (added to FieldType) */
	type: string
	/** How the fields will be imported to the types file */
	importAs: string
	/** The description of the field */
	description: string
}

export interface IVersionRequiredErrorOptions
	extends ISpruceErrorOptions<ErrorCode> {
	code: ErrorCode.VersionNotFound
	schemaId?: string
}
