import AbstractField, { IFieldDefinition } from './AbstractField'
import { ISchemaDefinition } from '../Schema'
import { FieldType } from '#spruce:schema/fields/fieldType'
import Schema, { SchemaError } from '..'
import { SchemaErrorCode } from '../errors/error.types'

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
	public static normalizeOptionsToSchemasOrIds(
		field: ISchemaFieldDefinition
	): (string | ISchemaDefinition)[] {
		const { options } = field
		return [
			...(options.schemaIds || []),
			...(options.schemas || []),
			...(options.schemaId ? [options.schemaId] : []),
			...(options.schema ? [options.schema] : [])
		]
	}
	public static normalizeOptionsToSchemaIds(
		field: ISchemaFieldDefinition
	): string[] {
		const { options } = field
		const schemasOrIds: (string | ISchemaDefinition)[] = [
			...(options.schemaIds || []),
			...(options.schemas || []),
			...(options.schemaId ? [options.schemaId] : []),
			...(options.schema ? [options.schema] : [])
		]

		const ids: string[] = schemasOrIds.map(schemaOrId => {
			if (typeof schemaOrId === 'string') {
				return schemaOrId
			} else if (Schema.isDefinitionValid(schemaOrId)) {
				return schemaOrId.id
			} else {
				throw new SchemaError({
					code: SchemaErrorCode.InvalidSchemaDefinition,
					schemaId: JSON.stringify(options),
					errors: ['invalid_schema_field_options']
				})
			}
		})

		return ids
	}
	public static templateDetails() {
		return {
			valueType: 'ISchemaDefinition',
			description:
				'A way to map relationships. You only need to map relationships one way, two way is currently not supported.'
		}
	}
}
