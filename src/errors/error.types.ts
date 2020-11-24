import { SpruceErrorOptions, ISpruceErrorOptions } from '@sprucelabs/error'
import { FieldType } from '../fields/field.static.types'

export type SchemaErrorOptions =
	| DuplicateSchemaErrorOptions
	| SchemaErrorOptionsNotFound
	| InvalidFieldErrorOptions
	| TransformationFailedErrorOptions
	| InvalidSchemaDefinitionErrorOptions
	| NotImplementedErrorOptions
	| InvalidFieldOptionsErrorOptions
	| InvalidFieldRegistrationErrorOptions
	| VersionRequiredErrorOptions
	| SpruceErrorOptions

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
export interface InvalidFieldError {
	code: string
	error?: Error
	friendlyMessage?: string
	name: string
}
export interface InvalidFieldErrorOptions extends ISpruceErrorOptions {
	/** * The field did not pass validation */
	code: 'INVALID_FIELD'
	schemaId: string
	schemaName?: string
	errors: InvalidFieldError[]
}

export interface TransformationFailedErrorOptions extends ISpruceErrorOptions {
	/** * The field could not transform the value */
	code: 'TRANSFORMATION_ERROR'
	fieldType: FieldType
	incomingTypeof: string
	incomingValue: string
	errors?: InvalidFieldError[]
	name: string
}

export interface InvalidSchemaDefinitionErrorOptions
	extends ISpruceErrorOptions {
	/** * The field could not transform the value */
	code: 'INVALID_SCHEMA'
	schemaId: string
	errors: string[]
}

export interface NotImplementedErrorOptions extends ISpruceErrorOptions {
	/** * The field could not transform the value */
	code: 'NOT_IMPLEMENTED'
	instructions: string
}

export interface InvalidFieldOptionsErrorOptions extends ISpruceErrorOptions {
	/** * The field could not transform the value */
	code: 'INVALID_FIELD_OPTIONS'
	schemaId?: string
	fieldName?: string
	options: Record<string, any>
}

export interface InvalidFieldRegistrationErrorOptions
	extends ISpruceErrorOptions {
	/** * The field could not transform the value */
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
