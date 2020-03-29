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

/** build a schema type for use in your skill */
export function buildDefinition<T extends ISchemaDefinition>(schema: T): T {
	return schema
}
