import FieldBase, { IFieldBaseDefinition } from './Base'
import { ISchemaDefinition } from '../Schema'
import { FieldType } from './types'

export interface IFieldSchemaDefinition extends IFieldBaseDefinition {
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

export default class FieldSchema extends FieldBase<IFieldSchemaDefinition> {
	public static templateDetails() {
		return {
			definitionInterface: 'IFieldSchemaDefinition',
			valueType: 'ISchemaDefinition'
		}
	}
}
