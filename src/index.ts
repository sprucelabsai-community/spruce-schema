export * from './utilities/Parser'
export { default as Parser } from './utilities/Parser'
export * from './Schema'
export * from './fields'
export { default as Template } from './utilities/Template'
export * from './utilities/Template'
export * from './errors/types'
export { default as SchemaError } from './errors/SchemaError'

import Schema from './Schema'
export default Schema

import { ISchemaDefinition } from './Schema'
import { IFieldDefinition } from './fields'

/** build a schema type for use in your skill */
export function buildSchemaDefinition<T extends ISchemaDefinition>(schema: T): T {
	return schema
}

/** build a field type for use in your skill */
export function buildFieldDefinition<T extends IFieldDefinition>(field: T): T{
    return field
}