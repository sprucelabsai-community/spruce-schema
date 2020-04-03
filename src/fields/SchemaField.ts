import BaseField, { IBaseFieldDefinition } from './BaseField'
import { ISchemaDefinition } from '../Schema'
import { FieldType } from './types'

export interface ISchemaFieldDefinition extends IBaseFieldDefinition {
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

export default class SchemaField extends BaseField<ISchemaFieldDefinition> {
	public static templateDetails() {
		return {
			definitionInterface: 'ISchemaFieldDefinition',
			valueType: 'ISchemaDefinition'
		}
	}
}
