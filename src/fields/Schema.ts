import FieldBase, { IFieldBaseDefinition } from './Base'
import { ISchemaDefinition } from '../Schema'
import { FieldType } from './types'

export interface IFieldSchemaDefinition extends IFieldBaseDefinition {
	type: FieldType.Schema
	value?: ISchemaDefinition
	defaultValue?: ISchemaDefinition
	options: {
		/** the id of the schema you are relating to */
		schemaId?: string
		/** the actual schema */
		schema?: ISchemaDefinition
	}
}

export default class FieldSchema extends FieldBase<IFieldSchemaDefinition> {
	public definitionInterfaceString = 'IFieldSchemaDefinition'
	public typeEnumString = 'FieldType.Schema'
}
