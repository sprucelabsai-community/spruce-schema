import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import {
	ISchemaIdWithVersion,
	ISchemaFieldDefinitionValueUnion,
	ISchemaDefinition
} from '../schema.types'
import { IFieldDefinition } from './field.static.types'

export type ISchemaFieldDefinition = IFieldDefinition<
	Record<string, any>,
	Record<string, any>,
	ISchemaFieldDefinitionValueUnion[],
	ISchemaFieldDefinitionValueUnion[]
> & {
	/** * .Schema go team! */
	type: FieldType.Schema
	options: {
		/** The id of the schema you are relating to */
		schemaId?: ISchemaIdWithVersion
		/** The actual schema */
		schema?: ISchemaDefinition
		/** If this needs to be a union of ids */
		schemaIds?: ISchemaIdWithVersion[]
		/** Actual schemas if more that one, this will make a union */
		schemas?: ISchemaDefinition[]
		/** Set a callback to return schema definitions (Do not use if you plan on sharing your definitions) */
		schemasCallback?: () => ISchemaDefinition[]
	}
}
