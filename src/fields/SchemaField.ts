import AbstractField from './AbstractField'
import Schema from '../Schema'
import FieldType from '#spruce:schema/fields/fieldType'
import { ErrorCode, IInvalidFieldError } from '../errors/error.types'
import {
	IFieldTemplateDetailOptions,
	IFieldTemplateDetails,
	TemplateRenderAs
} from '../template.types'
import SchemaError from '../errors/SchemaError'
import {
	ISchemaDefinition,
	IFieldDefinition,
	ToValueTypeOptions,
	FieldDefinitionValueType,
	ValidateOptions,
	ISchemaFieldDefinitionValueUnion,
	IFieldDefinitionToSchemaDefinitionOptions
} from '../schema.types'

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
		schemaId?: string
		/** The actual schema */
		schema?: ISchemaDefinition
		/** If this needs to be a union of ids */
		schemaIds?: string[]
		/** Actual schemas if more that one, this will make a union */
		schemas?: ISchemaDefinition[]
		/** Set a callback to return schema definitions (Do not use if you plan on sharing your definitions) */
		schemasCallback?: () => ISchemaDefinition[]
	}
}

export default class SchemaField<
	F extends ISchemaFieldDefinition = ISchemaFieldDefinition
> extends AbstractField<F> {
	public static get description() {
		return 'A way to map relationships.'
	}
	/** Take field options and get you an array of schema definitions or ids */
	public static fieldDefinitionToSchemasOrIds(
		field: ISchemaFieldDefinition
	): (string | ISchemaDefinition)[] {
		const { options } = field
		const schemasOrIds: (string | ISchemaDefinition)[] = [
			...(options.schema ? [options.schema] : []),
			...(options.schemaId ? [options.schemaId] : []),
			...(options.schemas || []),
			...(options.schemaIds || []),
			...(options.schemasCallback ? options.schemasCallback() : [])
		]

		return schemasOrIds.map(item => {
			if (typeof item === 'string') {
				return item
			}

			try {
				Schema.validateDefinition(item)
				return item
			} catch (err) {
				throw new SchemaError({
					code: ErrorCode.InvalidSchemaDefinition,
					schemaId: JSON.stringify(options),
					originalError: err,
					errors: ['invalid_schema_field_options']
				})
			}
		})
	}

	/** Take field options and turn it into an array of schema id's */
	public static fieldDefinitionToSchemaIds(
		field: ISchemaFieldDefinition
	): string[] {
		const { options } = field
		const schemasOrIds: (string | ISchemaDefinition)[] = [
			...(options.schema ? [options.schema] : []),
			...(options.schemaId ? [options.schemaId] : []),
			...(options.schemas || []),
			...(options.schemaIds || []),
			...(options.schemasCallback ? options.schemasCallback() : [])
		]

		const ids: string[] = schemasOrIds.map(schemaOrId => {
			if (typeof schemaOrId === 'string') {
				return schemaOrId
			}
			try {
				Schema.isDefinitionValid(schemaOrId)
				return schemaOrId.id
			} catch (err) {
				throw new SchemaError({
					code: ErrorCode.InvalidSchemaDefinition,
					schemaId: JSON.stringify(options),
					originalError: err,
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
		const schemaIds = SchemaField.fieldDefinitionToSchemaIds(definition)
		const unions: { schemaId: string; valueType: string }[] = []

		schemaIds.forEach(schemaId => {
			const matchedTemplateItem = templateItems.find(
				item => item.id.toLowerCase() === schemaId.toLowerCase()
			)

			if (matchedTemplateItem) {
				let valueType: string | undefined
				if (renderAs === TemplateRenderAs.Value) {
					valueType = `${matchedTemplateItem.nameCamel}Definition${matchedTemplateItem.namespace}`
				} else {
					valueType = `${globalNamespace}.${matchedTemplateItem.namespace}.${
						renderAs === TemplateRenderAs.Type
							? `I${matchedTemplateItem.namePascal}`
							: matchedTemplateItem.namePascal
					}${
						renderAs === TemplateRenderAs.DefinitionType ? `.IDefinition` : ``
					}`

					if (renderAs === TemplateRenderAs.Type && schemaIds.length > 1) {
						valueType = `{ schemaId: '${schemaId}', values: ${valueType} }`
					}
				}

				unions.push({
					schemaId: matchedTemplateItem.id,
					valueType
				})
			} else {
				throw new SchemaError({
					code: ErrorCode.SchemaNotFound,
					schemaId,
					friendlyMessage:
						'Failed during generation of value type on the Schema field. This can happen if schema id "${schemaId}" is not in "templateItems" (which should hold every schema in your skill).'
				})
			}
		})

		let valueType
		if (renderAs === TemplateRenderAs.Value) {
			valueType = '[' + unions.map(item => item.valueType).join(', ') + ']'
		} else {
			valueType = unions.map(item => item.valueType).join(' | ')
			valueType = `${
				(definition.isArray || renderAs === TemplateRenderAs.DefinitionType) &&
				unions.length > 1
					? `(${valueType})`
					: `${valueType}`
			}${
				definition.isArray || renderAs === TemplateRenderAs.DefinitionType
					? '[]'
					: ''
			}`
		}

		return {
			valueType
		}
	}

	/** Turn a field definition into it's related schemas, but requires the schemas be registered */
	private static fieldDefinitionToSchemaDefinitions(
		definition: ISchemaFieldDefinition,
		options?: IFieldDefinitionToSchemaDefinitionOptions
	): ISchemaDefinition[] {
		const { definitionsById = {} } = options || {}
		const schemasOrIds = SchemaField.fieldDefinitionToSchemasOrIds(definition)

		const definitions = schemasOrIds.map(schemaOrId => {
			const definition =
				typeof schemaOrId === 'string'
					? definitionsById[schemaOrId] || Schema.getDefinition(schemaOrId)
					: schemaOrId

			Schema.validateDefinition(definition)
			return definition
		})

		return definitions
	}

	/** Make sure value is a legit value */
	public validate(
		value: any,
		options?: ValidateOptions<ISchemaFieldDefinition>
	): IInvalidFieldError[] {
		const errors = super.validate(value, options)

		// do not validate schemas by default, very heavy and only needed when explicitly asked to
		if (value instanceof Schema) {
			try {
				Schema.validateDefinition(value)
			} catch (err) {
				errors.push({
					error: err,
					code: 'schema_field_invalid',
					name: this.name
				})
			}
		}

		if (errors.length === 0 && value) {
			if (typeof value !== 'object') {
				errors.push({
					code: 'value_must_be_object',
					name: this.name,
					friendlyMessage: `${this.label ?? this.name} must be an object`
				})
			} else {
				let definitions: ISchemaDefinition[] | undefined

				try {
					// pull schemas out of our own definition
					definitions = SchemaField.fieldDefinitionToSchemaDefinitions(
						this.definition,
						options
					)
				} catch (err) {
					errors.push({
						code: 'related_schema_id_not_valid',
						name: this.name,
						error: err
					})
				}

				if (definitions && definitions.length === 0) {
					errors.push({ code: 'related_schemas_missing', name: this.name })
				}

				// if we are validating schemas, we look them all up by id
				let instance: Schema<ISchemaDefinition> | undefined
				if (definitions && definitions.length === 1) {
					instance = new Schema(definitions[0], value)
				} else if (definitions && definitions.length > 0) {
					const { schemaId, values } = value || {}

					if (!values) {
						errors.push({
							name: this.name,
							code: 'schema_union_missing_values',
							friendlyMessage:
								'You need to add `values` to the value of ' + this.name
						})
					} else if (!schemaId) {
						errors.push({
							name: this.name,
							code: 'schema_union_missing_schema_id',
							friendlyMessage:
								'You need to add `schemaId` to the value of ' + this.name
						})
					} else {
						const matchDefinition = definitions.find(def => def.id === schemaId)
						if (!matchDefinition) {
							errors.push({
								name: this.name,
								code: 'related_schema_not_found',
								friendlyMessage: `Could not find a schema by id ${schemaId}`
							})
						} else {
							instance = new Schema(matchDefinition, values)
						}
					}
				}

				if (instance) {
					try {
						instance.validate()
					} catch (err) {
						errors.push({
							code: 'invalid_related_schema_values',
							error: err,
							name: this.name
						})
					}
				}
			}
		}
		return errors
	}

	/** To a value type */
	public toValueType<CreateSchemaInstances extends boolean>(
		value: any,
		options?: ToValueTypeOptions<ISchemaFieldDefinition, CreateSchemaInstances>
	): FieldDefinitionValueType<F, CreateSchemaInstances> {
		//  first lets validate it's a good form
		const errors = this.validate(value, options)

		if (errors.length > 0) {
			throw new SchemaError({
				code: ErrorCode.TransformationFailed,
				fieldType: FieldType.Schema,
				incomingTypeof: typeof value,
				incomingValue: value,
				errors,
				name: this.name
			})
		}

		const { createSchemaInstances, definitionsById = {} } = options || {}

		// try and pull the schema definition from the options and by id
		const destinationDefinitions: ISchemaDefinition[] = SchemaField.fieldDefinitionToSchemaDefinitions(
			this.definition,
			{ definitionsById }
		)

		const isUnion = destinationDefinitions.length > 1
		let instance: Schema<ISchemaDefinition> | undefined

		// if we are only pointing 1 one possible definition, then mapping is pretty easy
		if (!isUnion) {
			instance = new Schema(destinationDefinitions[0], value)
		} else {
			// this could be one of a few types, lets check the "schemaId" prop
			const { schemaId, values } = value
			const matchedDefinition = destinationDefinitions.find(
				def => def.id === schemaId
			)
			if (!matchedDefinition) {
				throw new SchemaError({
					code: ErrorCode.TransformationFailed,
					fieldType: FieldType.Schema,
					name: this.name,
					incomingValue: value,
					incomingTypeof: typeof value
				})
			}
			instance = new Schema(matchedDefinition, values)
		}

		if (createSchemaInstances) {
			return instance as FieldDefinitionValueType<F, CreateSchemaInstances>
		}

		if (isUnion) {
			return {
				schemaId: instance.schemaId,
				values: instance.getValues({ validate: false, createSchemaInstances })
			} as FieldDefinitionValueType<F, CreateSchemaInstances>
		}

		return instance.getValues({
			validate: false,
			createSchemaInstances
		}) as FieldDefinitionValueType<F, CreateSchemaInstances>
	}
}
