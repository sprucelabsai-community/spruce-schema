import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { IInvalidFieldError } from '../errors/error.types'
import SpruceError from '../errors/SpruceError'
import Schema from '../Schema'
import {
	ISchemaDefinition,
	ISchemaIdWithVersion,
} from '../schemas.static.types'
import {
	IFieldTemplateDetailOptions,
	IFieldTemplateDetails,
	TemplateRenderAs,
} from '../template.types'
import AbstractField from './AbstractField'
import {
	IFieldDefinitionToSchemaDefinitionOptions,
	ValidateOptions,
	ToValueTypeOptions,
	FieldDefinitionValueType,
} from './field.static.types'
import { ISchemaFieldDefinition } from './SchemaField.types'

export default class SchemaField<
	F extends ISchemaFieldDefinition = ISchemaFieldDefinition
> extends AbstractField<F> {
	public static get description() {
		return 'A way to map relationships.'
	}

	public static get valueTypeGeneratorType() {
		return 'SchemaFieldValueTypeGenerator<F extends ISchemaFieldDefinition? F : ISchemaFieldDefinition, CreateSchemaInstances>'
	}

	public static mapFieldDefinitionToSchemasOrIdsWithVersion(
		field: ISchemaFieldDefinition
	): (ISchemaIdWithVersion | ISchemaDefinition)[] {
		const { options } = field
		const schemasOrIds: (
			| { version?: string; id: string }
			| ISchemaDefinition
		)[] = [
			...(options.schema ? [options.schema] : []),
			...(options.schemaId ? [options.schemaId] : []),
			...(options.schemas || []),
			...(options.schemaIds || []),
			...(options.schemasCallback ? options.schemasCallback() : []),
		]

		return schemasOrIds.map((item) => {
			if (typeof item === 'string') {
				return { id: item }
			}

			if (
				typeof item.id === 'string' &&
				typeof (item as any).name === 'undefined'
			) {
				return item
			}

			try {
				Schema.validateDefinition(item)
				return item
			} catch (err) {
				throw new SpruceError({
					code: 'INVALID_SCHEMA_DEFINITION',
					schemaId: JSON.stringify(options),
					originalError: err,
					errors: ['invalid_schema_field_options'],
				})
			}
		})
	}

	public static mapFieldDefinitionToSchemaIdsWithVersion(
		field: ISchemaFieldDefinition
	): ISchemaIdWithVersion[] {
		const schemasOrIds = this.mapFieldDefinitionToSchemasOrIdsWithVersion(field)

		const ids: ISchemaIdWithVersion[] = schemasOrIds.map((item) => {
			if (
				typeof item.id === 'string' &&
				typeof (item as any).name === 'undefined'
			) {
				return item
			}

			const idWithVersion: ISchemaIdWithVersion = {
				id: item.id,
			}

			if (item.version) {
				idWithVersion.version = item.version
			}

			return idWithVersion
		})

		return ids
	}

	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<ISchemaFieldDefinition>
	): IFieldTemplateDetails {
		const { templateItems, renderAs, definition, globalNamespace } = options
		const idsWithVersion = SchemaField.mapFieldDefinitionToSchemaIdsWithVersion(
			definition
		)
		const unions: { schemaId: string; valueType: string }[] = []

		idsWithVersion.forEach((idWithVersion) => {
			const { id, version } = idWithVersion
			const allMatches = templateItems.filter(
				(item) => item.id.toLowerCase() === id.toLowerCase()
			)

			let matchedTemplateItem

			if (allMatches.length === 0) {
				matchedTemplateItem = allMatches[0]
			} else {
				matchedTemplateItem = allMatches.find(
					(d) => d.definition.version === version
				)

				if (!matchedTemplateItem) {
					throw new SpruceError({
						code: 'VERSION_NOT_FOUND',
						schemaId: id,
					})
				}
			}

			if (matchedTemplateItem) {
				let valueType: string | undefined
				if (renderAs === TemplateRenderAs.Value) {
					valueType = `${matchedTemplateItem.nameCamel}Definition`
				} else {
					valueType = `${globalNamespace}.${matchedTemplateItem.namespace}.${
						renderAs === TemplateRenderAs.Type
							? `I${matchedTemplateItem.namePascal}`
							: matchedTemplateItem.namePascal
					}${version ? `.${version}` : ''}${
						renderAs === TemplateRenderAs.DefinitionType ? `.IDefinition` : ``
					}`

					if (renderAs === TemplateRenderAs.Type && idsWithVersion.length > 1) {
						valueType = `{ schemaId: '${id}'${
							version ? `, version: '${version}'` : ''
						}, values: ${valueType} }`
					}
				}

				unions.push({
					schemaId: matchedTemplateItem.id,
					valueType,
				})
			} else {
				throw new SpruceError({
					code: 'SCHEMA_NOT_FOUND',
					schemaId: id,
					friendlyMessage:
						'Failed during generation of value type on the Schema field. This can happen if schema id "${schemaId}" is not in "templateItems" (which should hold every schema in your skill).',
				})
			}
		})

		let valueType
		if (renderAs === TemplateRenderAs.Value) {
			valueType = '[' + unions.map((item) => item.valueType).join(', ') + ']'
		} else {
			valueType = unions.map((item) => item.valueType).join(' | ')
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
			valueTypeGenerator:
				'SchemaValueTypeGenerator<F extends ISchemaFieldDefinition? F : ISchemaFieldDefinition, CreateSchemaInstances>',
			valueType,
		}
	}

	private static mapFieldDefinitionToSchemaDefinitions(
		definition: ISchemaFieldDefinition,
		options?: IFieldDefinitionToSchemaDefinitionOptions
	): ISchemaDefinition[] {
		const { definitionsById = {} } = options || {}
		const schemasOrIds = SchemaField.mapFieldDefinitionToSchemasOrIdsWithVersion(
			definition
		)

		const definitions = schemasOrIds.map((schemaOrId) => {
			const definition =
				typeof schemaOrId === 'string'
					? definitionsById[schemaOrId] || Schema.getDefinition(schemaOrId)
					: schemaOrId

			Schema.validateDefinition(definition)
			return definition
		})

		return definitions
	}

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
					name: this.name,
				})
			}
		}

		if (errors.length === 0 && value) {
			if (typeof value !== 'object') {
				errors.push({
					code: 'value_must_be_object',
					name: this.name,
					friendlyMessage: `${this.label ?? this.name} must be an object`,
				})
			} else {
				let definitions: ISchemaDefinition[] | undefined

				try {
					// pull schemas out of our own definition
					definitions = SchemaField.mapFieldDefinitionToSchemaDefinitions(
						this.definition,
						options
					)
				} catch (err) {
					errors.push({
						code: 'related_schema_id_not_valid',
						name: this.name,
						error: err,
					})
				}

				if (definitions && definitions.length === 0) {
					errors.push({ code: 'related_schemas_missing', name: this.name })
				}

				// if we are validating schemas, we look them all up by id
				let instance: Schema<ISchemaDefinition> | undefined
				if (definitions && definitions.length === 1) {
					// @ts-ignore warns about infinite recursion, which is true, because relationships between schemas can go forever
					// because
					instance = new Schema(definitions[0], value)
				} else if (definitions && definitions.length > 0) {
					const { schemaId, values } = value || {}

					if (!values) {
						errors.push({
							name: this.name,
							code: 'schema_union_missing_values',
							friendlyMessage:
								'You need to add `values` to the value of ' + this.name,
						})
					} else if (!schemaId) {
						errors.push({
							name: this.name,
							code: 'schema_union_missing_schema_id',
							friendlyMessage:
								'You need to add `schemaId` to the value of ' + this.name,
						})
					} else {
						const matchDefinition = definitions.find(
							(def) => def.id === schemaId
						)
						if (!matchDefinition) {
							errors.push({
								name: this.name,
								code: 'related_schema_not_found',
								friendlyMessage: `Could not find a schema by id ${schemaId}`,
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
							name: this.name,
						})
					}
				}
			}
		}
		return errors
	}

	public toValueType<CreateSchemaInstances extends boolean>(
		value: any,
		options?: ToValueTypeOptions<ISchemaFieldDefinition, CreateSchemaInstances>
	): FieldDefinitionValueType<F, CreateSchemaInstances> {
		//  first lets validate it's a good form
		const errors = this.validate(value, options)

		if (errors.length > 0) {
			throw new SpruceError({
				code: 'TRANSFORMATION_ERROR',
				fieldType: FieldType.Schema,
				incomingTypeof: typeof value,
				incomingValue: value,
				errors,
				name: this.name,
			})
		}

		const { createSchemaInstances, definitionsById = {} } = options || {}

		// try and pull the schema definition from the options and by id
		const destinationDefinitions: ISchemaDefinition[] = SchemaField.mapFieldDefinitionToSchemaDefinitions(
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
			const allMatches = destinationDefinitions.filter(
				(def) => def.id === schemaId
			)
			let matchedDefinition: ISchemaDefinition | undefined

			if (allMatches.length === 0) {
				throw new SpruceError({
					code: 'TRANSFORMATION_ERROR',
					fieldType: FieldType.Schema,
					name: this.name,
					incomingValue: value,
					incomingTypeof: typeof value,
				})
			}

			if (allMatches.length > 1) {
				if (value.version) {
					matchedDefinition = allMatches.find(
						(def) => def.version === value.version
					)
				}

				if (!matchedDefinition) {
					throw new SpruceError({
						code: 'VERSION_NOT_FOUND',
						schemaId,
					})
				}
			} else {
				matchedDefinition = allMatches[0]
			}

			instance = new Schema(matchedDefinition, values)
		}

		if (createSchemaInstances) {
			return instance as FieldDefinitionValueType<F, CreateSchemaInstances>
		}

		if (isUnion) {
			return {
				schemaId: instance.schemaId,
				values: instance.getValues({ validate: false, createSchemaInstances }),
			} as FieldDefinitionValueType<F, CreateSchemaInstances>
		}

		return instance.getValues({
			validate: false,
			createSchemaInstances,
		}) as FieldDefinitionValueType<F, CreateSchemaInstances>
	}
}
