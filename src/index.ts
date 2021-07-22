export * from './StaticSchemaEntityImplementation'

import addressRegistration from './addons/addressField.addon'
import booleanRegistration from './addons/booleanField.addon'
import dateRegistration from './addons/dateField.addon'
import dateTimeRegistration from './addons/dateTimeField.addon'
import directoryRegistration from './addons/directoryField.addon'
import durationRegistration from './addons/durationField.addon'
import emailRegisteration from './addons/emailField.addon'
import fileRegistration from './addons/fileField.addon'
import idRegistration from './addons/idField.addon'
import numberRegistration from './addons/numberField.addon'
import phoneRegistration from './addons/phoneField.addon'
import rawRegistration from './addons/rawField.addon'
import schemaRegistration from './addons/schemaField.addon'
import selectRegistration from './addons/selectField.addon'
import textRegistration from './addons/textField.addon'
import StaticSchemaEntityImplementation from './StaticSchemaEntityImplementation'
import { FieldRegistration } from './utilities/registerFieldType'

export default StaticSchemaEntityImplementation

export * from './schemas.static.types'

export * from './fields'

export * from './errors/error.types'
export { default as SchemaError } from './errors/SpruceError'

export { default as buildErrorSchema } from './utilities/buildErrorSchema'
export { default as buildSchema } from './utilities/buildSchema'

export * from './utilities/optional.types'
export * from './utilities/selectChoicesToHash'
export * from './utilities/registerFieldType'
export { default as registerFieldType } from './utilities/registerFieldType'
export { default as mapSchemaErrorsToParameterErrors } from './utilities/mapSchemaErrorsToParameterErrors'
export { default as defaultSchemaValues } from './utilities/defaultSchemaValues'
export { default as validateSchemaValues } from './utilities/validateSchemaValues'
export { default as normalizeSchemaValues } from './utilities/normalizeSchemaValues'
export { default as areSchemaValuesValid } from './utilities/areSchemaValuesValid'
export { default as makeFieldsOptional } from './utilities/makeFieldsOptional'
export { default as dropFields } from './utilities/dropFields'
export { default as dropPrivateFields } from './utilities/dropPrivateFields'
export { default as validateSchema } from './utilities/validateSchema'
export { default as isSchemaValid } from './utilities/isSchemaValid'
export { default as areSchemasTheSame } from './utilities/areSchemasTheSame'
export { default as formatPhoneNumber } from './utilities/formatPhoneNumber'
export { default as isIdWithVersion } from './utilities/isIdWithVersion'
export { default as normalizeSchemaToIdWithVersion } from './utilities/normalizeSchemaToIdWithVersion'
export * from './utilities/formatPhoneNumber'

export { default as FieldFactory } from './factories/FieldFactory'
export { default as SchemaEntityFactory } from './factories/SchemaEntityFactory'

export * from './types/template.types'
export * from './types/utilities.types'

export { default as SchemaRegistry } from './singletons/SchemaRegistry'

export { default as SpruceError } from './errors/SpruceError'

export const fieldRegistrations: FieldRegistration[] = [
	addressRegistration,
	booleanRegistration,
	dateRegistration,
	dateTimeRegistration,
	directoryRegistration,
	durationRegistration,
	fileRegistration,
	idRegistration,
	numberRegistration,
	phoneRegistration,
	rawRegistration,
	schemaRegistration,
	selectRegistration,
	textRegistration,
	emailRegisteration,
]

export { default as assertOptions } from './utilities/assertOptions'
