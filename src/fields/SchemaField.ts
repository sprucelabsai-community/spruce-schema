import AbstractField, { IFieldDefinition } from './AbstractField'
import { ISchemaDefinition } from '../Schema'
import { FieldType } from '#spruce:schema/fields/fieldType'

export type ISchemaFieldDefinition = IFieldDefinition<ISchemaDefinition> & {
	/** * .Schema go team! */
	type: FieldType.Schema
	options: {
		/** The id of the schema you are relating to */
		schemaId?: string
		/** The actual schema */
		schema?: ISchemaDefinition
		/** If this needs to be a union of ids */
		schemaIds?: string[]
		/** Actual schemas if more that one, this will make a union */
		schemas?: ISchemaDefinition[]
	}
}

export default class SchemaField extends AbstractField<ISchemaFieldDefinition> {
	public static templateDetails() {
		return {
			valueType: 'ISchemaDefinition',
			description:
				'A way to map relationships. You only need to map relationships one way, two way is currently not supported.'
		}
	}
}
