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
	/** The schema associated with this error */
	schemaId: string
	/** Field errors that occurred */
	errors: IInvalidFieldError[]
}

export interface ITransformationFailedErrorOptions extends ISpruceErrorOptions {
	/** * The field could not transform the value */
	code: 'TRANSFORMATION_ERROR'
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
	extends ISpruceErrorOptions {
	/** * The field could not transform the value */
	code: 'INVALID_SCHEMA_DEFINITION'
	/** The id of the schema */
	schemaId: string
	/** All the errors in the definition */
	errors: string[]
}

export interface INotImplementedErrorOptions extends ISpruceErrorOptions {
	/** * The field could not transform the value */
	code: 'NOT_IMPLEMENTED'
	/** What someone is to do based on something to being implemented */
	instructions: string
}

export interface IInvalidFieldOptionsErrorOptions extends ISpruceErrorOptions {
	/** * The field could not transform the value */
	code: 'INVALID_FIELD_OPTIONS'
	/** The schema with the bad options */
	schemaId?: string
	/** The field with the bad options */
	fieldName?: string
	/** The bad options  */
	options: Record<string, any>
}

export interface IInvalidFieldRegistrationErrorOptions
	extends ISpruceErrorOptions {
	/** * The field could not transform the value */
	code: 'INVALID_FIELD_REGISTRATION'
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

export interface IVersionRequiredErrorOptions extends ISpruceErrorOptions {
	code: 'VERSION_NOT_FOUND'
	schemaId?: string
}

export interface IFieldNotFoundErrorOptions extends ISpruceErrorOptions {
	code: 'FIELD_NOT_FOUND'
	schemaId: string
	fields: string[]
}
