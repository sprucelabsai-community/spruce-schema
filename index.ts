// Schema class is default export
import { Schema } from './src'
export default Schema

// Field type enum
export { FieldType } from '#spruce:schema/fields/fieldType'

// All types needed to work with schemas
export {
	FieldDefinition,
	FieldClass,
	Field,
	FieldDefinitionMap,
	FieldClassMap,
	IFieldClassMap
} from '#spruce:schema/types'

// All src
export * from './src'
