import { SpruceErrorOptions, ISpruceErrorOptions } from '@sprucelabs/error'
import { FieldType } from '../fields/field.static.types'

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
	| IFieldNotFoundErrorOptions

export interface ISchemaErrorOptionsNotFound extends ISpruceErrorOptions {
	/** * Could not find a schema by id */
	code: 'SCHEMA_NOT_FOUND'
	schemaId: string
	version?: string
}

export interface IDuplicateSchemaErrorOptions extends ISpruceErrorOptions {
	/** * A schema with this id already exists */
	code: 'DUPLICATE_SCHEMA'
	schemaId: string
	version?: string
}
export interface IInvalidFieldError {
	code: string
	error?: Error
	friendlyMessage?: string
	name: string
}
export interface IInvalidFieldErrorOptions extends ISpruceErrorOptions {
	/** * The field did not pass validation */
	code: 'INVALID_FIELD'
	schemaId: string
	schemaName?: string
	errors: IInvalidFieldError[]
}

export interface ITransformationFailedErrorOptions extends ISpruceErrorOptions {
	/** * The field could not transform the value */
	code: 'TRANSFORMATION_ERROR'
	fieldType: FieldType
	incomingTypeof: string
	incomingValue: string
	errors?: IInvalidFieldError[]
	name: string
}

export interface IInvalidSchemaDefinitionErrorOptions
	extends ISpruceErrorOptions {
	/** * The field could not transform the value */
	code: 'INVALID_SCHEMA'
	schemaId: string
	errors: string[]
}

export interface INotImplementedErrorOptions extends ISpruceErrorOptions {
	/** * The field could not transform the value */
	code: 'NOT_IMPLEMENTED'
	instructions: string
}

export interface IInvalidFieldOptionsErrorOptions extends ISpruceErrorOptions {
	/** * The field could not transform the value */
	code: 'INVALID_FIELD_OPTIONS'
	schemaId?: string
	fieldName?: string
	options: Record<string, any>
}

export interface IInvalidFieldRegistrationErrorOptions
	extends ISpruceErrorOptions {
	/** * The field could not transform the value */
	code: 'INVALID_FIELD_REGISTRATION'
	package: string
	className: string
	type: string
	importAs: string
	description: string
}

export interface IVersionRequiredErrorOptions extends ISpruceErrorOptions {
	code: 'VERSION_NOT_FOUND'
	schemaId?: string
}

export interface IFieldNotFoundErrorOptions extends ISpruceErrorOptions {
	code: 'FIELD_NOT_FOUND'
	schemaId: string
	fields: string[]
}
