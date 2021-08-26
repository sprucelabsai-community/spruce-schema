import AbstractSpruceError, {
	ErrorOptions as ISpruceErrorOptions,
} from '@sprucelabs/error'
import { FieldType } from '../fields/field.static.types'

export type SchemaErrorOptions =
	| DuplicateSchemaErrorOptions
	| SchemaErrorOptionsNotFound
	| TransformationFailedErrorOptions
	| InvalidSchemaDefinitionErrorOptions
	| NotImplementedErrorOptions
	| InvalidFieldRegistrationErrorOptions
	| VersionRequiredErrorOptions
	| MissingParametersOptions
	| InvalidParametersOptions
	| UnexpectedParametersOptions
	| ValidationFailedErrorOptions

export type FieldErrorCode =
	| 'MISSING_PARAMETER'
	| 'INVALID_PARAMETER'
	| 'UNEXPECTED_PARAMETER'

export interface FieldError {
	code: FieldErrorCode
	errors?: FieldError[]
	friendlyMessage?: string
	originalError?: Error
	name: string
	label?: string
}

export interface SchemaErrorOptionsNotFound extends ISpruceErrorOptions {
	/** * Could not find a schema by id */
	code: 'SCHEMA_NOT_FOUND'
	schemaId: string
	version?: string
	namespace?: string
}

export interface DuplicateSchemaErrorOptions extends ISpruceErrorOptions {
	/** * A schema with this id already exists */
	code: 'DUPLICATE_SCHEMA'
	schemaId: string
	version?: string
	namespace?: string
}

export interface TransformationFailedErrorOptions extends ISpruceErrorOptions {
	code: 'TRANSFORMATION_ERROR'
	fieldType: FieldType
	incomingTypeof: string
	incomingValue: string
	errors?: FieldError[]
	name: string
}

export interface InvalidSchemaDefinitionErrorOptions
	extends ISpruceErrorOptions {
	code: 'INVALID_SCHEMA'
	schemaId: string
	errors: string[]
}

export interface NotImplementedErrorOptions extends ISpruceErrorOptions {
	code: 'NOT_IMPLEMENTED'
	instructions: string
}

export interface InvalidFieldRegistrationErrorOptions
	extends ISpruceErrorOptions {
	code: 'INVALID_FIELD_REGISTRATION'
	package: string
	className: string
	type: string
	importAs: string
	description: string
}

export interface VersionRequiredErrorOptions extends ISpruceErrorOptions {
	code: 'VERSION_NOT_FOUND'
	schemaId?: string
	namespace?: string
}

interface ParamaterOptions extends ISpruceErrorOptions {
	parameters: string[]
	friendlyMessages?: string[]
	errors?: FieldError[]
}

export interface MissingParametersOptions extends ParamaterOptions {
	code: 'MISSING_PARAMETERS'
}

export interface InvalidParametersOptions extends ParamaterOptions {
	code: 'INVALID_PARAMETERS'
}

export interface UnexpectedParametersOptions extends ParamaterOptions {
	code: 'UNEXPECTED_PARAMETERS'
}

export interface ValidationFailedErrorOptions extends ISpruceErrorOptions {
	code: 'VALIDATION_FAILED'
	schemaId: string
	schemaName?: string
	errors: FieldError[]
}

export type ValidationError = AbstractSpruceError<
	| MissingParametersOptions
	| InvalidParametersOptions
	| UnexpectedParametersOptions
>
