import AbstractField, { IFieldDefinition } from './AbstractField'
import { ISchemaDefinition } from '../Schema'
import { FieldType } from '#spruce:schema/fields/fieldType'
import Schema, { SchemaError } from '..'
import { SchemaErrorCode } from '../errors/error.types'
import {
	IFieldTemplateDetailOptions,
	IFieldTemplateDetails,
	TemplateRenderAs
} from '../template.types'

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

export interface ISchemaFieldDefinitionValueUnion {
	schemaId: string
	values: Record<string, any>
}

export default class SchemaField extends AbstractField<ISchemaFieldDefinition> {
	public static get description() {
		return 'A way to map relationships.'
	}
	/** Take field options and get you an array of schema definitions or ids */
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

	/** Take field options and turn it into an array of schema id's */
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

	public static templateDetails(
		options: IFieldTemplateDetailOptions<ISchemaFieldDefinition>
	): IFieldTemplateDetails {
		const { templateItems, renderAs, definition, globalNamespace } = options
		const schemaIds = SchemaField.normalizeOptionsToSchemaIds(definition)
		const unions: { schemaId: string; valueType: string }[] = []

		schemaIds.forEach(schemaId => {
			const matchedTemplateItem = templateItems.find(
				item => item.id === schemaId
			)

			if (matchedTemplateItem) {
				unions.push({
					schemaId: matchedTemplateItem.id,
					valueType: `${globalNamespace}.${matchedTemplateItem.namespace}.${
						renderAs === 'type'
							? `I${matchedTemplateItem.pascalName}`
							: matchedTemplateItem.pascalName
					}${
						renderAs === 'type'
							? ``
							: renderAs === 'definitionType'
							? `.IDefinition`
							: `.definition`
					}`
				})
			} else {
				throw new SchemaError({
					code: SchemaErrorCode.SchemaNotFound,
					schemaId,
					friendlyMessage:
						'Failed during generation of value type on the Schema field. This can happen if schema id "${schemaId}" is not in "templateItems" (which should hold every schema in your skill).'
				})
			}
		})

		let valueType
		if (renderAs === TemplateRenderAs.Type) {
			valueType = unions
				.map(item => (schemaIds.length > 1 ? item : item.valueType))
				.join(' | ')
		} else {
			valueType = '[' + unions.map(item => item.valueType).join(', ') + ']'
		}

		return {
			valueType: `(${valueType})${definition.isArray ? '[]' : ''}`
		}
	}
}
