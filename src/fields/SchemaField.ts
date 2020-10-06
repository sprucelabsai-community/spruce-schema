import { IInvalidFieldError } from '../errors/error.types'
import SpruceError from '../errors/SpruceError'
import SchemaEntity from '../SchemaEntity'
import { ISchema, ISchemaIdWithVersion } from '../schemas.static.types'
import SchemaRegistry from '../singletons/SchemaRegistry'
import {
	IFieldTemplateDetailOptions,
	IFieldTemplateDetails,
	TemplateRenderAs,
} from '../types/template.types'
import isIdWithVersion from '../utilities/isIdWithVersion'
import validateSchema from '../utilities/validateSchema'
import AbstractField from './AbstractField'
import {
	IFieldDefinitionToSchemaOptions,
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

	public static mapFieldDefinitionToSchemasOrIdsWithVersion(
		field: ISchemaFieldDefinition
	): (ISchemaIdWithVersion | ISchema)[] {
		const { options } = field
		const schemasOrIds: ({ version?: string; id: string } | ISchema)[] = [
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

			if (isIdWithVersion(item)) {
				return item
			}

			try {
				validateSchema(item)
				return item
			} catch (err) {
				throw new SpruceError({
					code: 'INVALID_SCHEMA',
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
			if (isIdWithVersion(item)) {
				return item
			}

			const idWithVersion: ISchemaIdWithVersion = {
				id: item.id,
			}

			if (item.version) {
				idWithVersion.version = item.version
			}

			if (item.namespace) {
				idWithVersion.namespace = item.namespace
			}

			return idWithVersion
		})

		return ids
	}

	public static generateTypeDetails() {
		return {
			valueTypeMapper:
				'SchemaFieldValueTypeMapper<F extends ISchemaFieldDefinition? F : ISchemaFieldDefinition, CreateEntityInstances>',
		}
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
			const { id, version, namespace } = idWithVersion
			let allMatches = templateItems.filter(
				(item) => item.id.toLowerCase() === id.toLowerCase()
			)

			if (namespace) {
				allMatches = allMatches.filter(
					(item) => item.namespace.toLowerCase() === namespace.toLowerCase()
				)
			}

			let matchedTemplateItem

			if (allMatches.length === 0) {
				matchedTemplateItem = allMatches[0]
			} else {
				matchedTemplateItem = allMatches.find(
					(d) => d.schema.version === version
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
					valueType = `${matchedTemplateItem.nameCamel}Schema`
				} else {
					valueType = `${globalNamespace}.${matchedTemplateItem.namespace}${
						version ? `.${version}` : ''
					}${
						renderAs === TemplateRenderAs.Type
							? `.I${matchedTemplateItem.namePascal}`
							: `.I${matchedTemplateItem.namePascal}Schema`
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
			valueType =
				unions.length === 1
					? unions[0].valueType
					: '[' + unions.map((item) => item.valueType).join(', ') + ']'
		} else {
			valueType = unions.map((item) => item.valueType).join(' | ')
			valueType = `${
				(definition.isArray || renderAs === TemplateRenderAs.SchemaType) &&
				unions.length > 1
					? `(${valueType})`
					: `${valueType}`
			}${
				(definition.isArray && renderAs === TemplateRenderAs.Type) ||
				(unions.length > 1 && renderAs === TemplateRenderAs.SchemaType)
					? '[]'
					: ''
			}`
		}

		return {
			valueType,
		}
	}

	private static mapFieldDefinitionToSchemas(
		definition: ISchemaFieldDefinition,
		options?: IFieldDefinitionToSchemaOptions
	): ISchema[] {
		const { schemasById: schemasById = {} } = options || {}
		const schemasOrIds = SchemaField.mapFieldDefinitionToSchemasOrIdsWithVersion(
			definition
		)

		const schemas = schemasOrIds.map((schemaOrId) => {
			const schema =
				typeof schemaOrId === 'string'
					? schemasById[schemaOrId] ||
					  SchemaRegistry.getInstance().getSchema(schemaOrId)
					: schemaOrId

			validateSchema(schema)
			return schema
		})

		return schemas
	}

	public validate(
		value: any,
		options?: ValidateOptions<ISchemaFieldDefinition>
	): IInvalidFieldError[] {
		const errors = super.validate(value, options)

		// do not validate schemas by default, very heavy and only needed when explicitly asked to
		if (value instanceof SchemaEntity) {
			try {
				value.validate()
				return []
			} catch (err) {
				errors.push({
					error: err,
					code: 'invalid_value',
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
				let schemas: ISchema[] | undefined

				try {
					// pull schemas out of our own definition
					schemas = SchemaField.mapFieldDefinitionToSchemas(
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

				if (schemas && schemas.length === 0) {
					errors.push({ code: 'related_schemas_missing', name: this.name })
				}

				// if we are validating schemas, we look them all up by id
				let instance: SchemaEntity<ISchema> | undefined
				if (schemas && schemas.length === 1) {
					// @ts-ignore warns about infinite recursion, which is true, because relationships between schemas can go forever
					// because
					instance = new SchemaEntity(schemas[0], value)
				} else if (schemas && schemas.length > 0) {
					const { schemaId, version, values } = value || {}

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
						const matchSchema = schemas.find(
							(schema) => schema.id === schemaId && schema.version === version
						)
						if (!matchSchema) {
							errors.push({
								name: this.name,
								code: 'related_schema_not_found',
								friendlyMessage: `Could not find a schema by id '${schemaId}'${
									version ? ` and version '${version}'` : ' with no version'
								}.`,
							})
						} else {
							instance = new SchemaEntity(matchSchema, values)
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
							friendlyMessage: `'${this.label ?? this.name}' isn't valid.`,
						})
					}
				}
			}
		}

		return errors
	}

	public toValueType<CreateEntityInstances extends boolean>(
		value: any,
		options?: ToValueTypeOptions<ISchemaFieldDefinition, CreateEntityInstances>
	): FieldDefinitionValueType<F, CreateEntityInstances> {
		const errors = this.validate(value, options)

		if (errors.length > 0) {
			throw new SpruceError({
				code: 'TRANSFORMATION_ERROR',
				fieldType: 'schema',
				incomingTypeof: typeof value,
				incomingValue: value,
				errors,
				name: this.name,
			})
		}

		const { createEntityInstances, schemasById: schemasById = {} } =
			options || {}

		// try and pull the schema definition from the options and by id
		const destinationSchemas: ISchema[] = SchemaField.mapFieldDefinitionToSchemas(
			this.definition,
			{ schemasById }
		)

		const isUnion = destinationSchemas.length > 1
		let instance: SchemaEntity<ISchema> | undefined

		if (value instanceof SchemaEntity) {
			instance = value
		}
		// if we are only pointing 1 one possible definition, then mapping is pretty easy
		else if (!isUnion) {
			instance = new SchemaEntity(destinationSchemas[0], value)
		} else {
			// this could be one of a few types, lets check the "schemaId" prop
			const { schemaId, values } = value
			const allMatches = destinationSchemas.filter((def) => def.id === schemaId)
			let matchedSchema: ISchema | undefined

			if (allMatches.length === 0) {
				throw new SpruceError({
					code: 'TRANSFORMATION_ERROR',
					fieldType: 'schema',
					name: this.name,
					incomingValue: value,
					incomingTypeof: typeof value,
				})
			}

			if (allMatches.length > 1) {
				if (value.version) {
					matchedSchema = allMatches.find(
						(def) => def.version === value.version
					)
				}

				if (!matchedSchema) {
					throw new SpruceError({
						code: 'VERSION_NOT_FOUND',
						schemaId,
					})
				}
			} else {
				matchedSchema = allMatches[0]
			}

			instance = new SchemaEntity(matchedSchema, values)
		}

		if (createEntityInstances) {
			return instance as FieldDefinitionValueType<F, CreateEntityInstances>
		}

		if (isUnion) {
			return {
				schemaId: instance.schemaId,
				values: instance.getValues({ validate: false, createEntityInstances }),
			} as FieldDefinitionValueType<F, CreateEntityInstances>
		}

		return instance.getValues({
			validate: false,
			createEntityInstances,
		}) as FieldDefinitionValueType<F, CreateEntityInstances>
	}
}
