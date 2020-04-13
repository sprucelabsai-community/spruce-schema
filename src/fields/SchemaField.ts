import AbstractField, { IFieldDefinition } from './AbstractField'
import { ISchemaDefinition } from '../Schema'
import { FieldType } from '#spruce:schema/fields/fieldType'

export interface ISchemaFieldDefinition extends IFieldDefinition {
	/** * .Schema - A relationship to another schema */
	type: FieldType.Schema
	value?: ISchemaDefinition
	defaultValue?: ISchemaDefinition
	options: {
		/** The id of the schema you are relating to */
		schemaId?: string
		/** The actual schema */
		schema?: ISchemaDefinition
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
