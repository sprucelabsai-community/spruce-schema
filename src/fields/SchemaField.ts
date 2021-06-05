import AbstractEntity from '../AbstractEntity'
import DynamicSchemaEntityImplementation from '../DynamicSchemaEntityImplementation'
import { InvalidFieldError } from '../errors/error.types'
import SpruceError from '../errors/SpruceError'
import {
	Schema,
	SchemaIdWithVersion,
	SchemaEntity,
} from '../schemas.static.types'
import SchemaRegistry from '../singletons/SchemaRegistry'
import StaticSchemaEntity from '../StaticSchemaEntityImplementation'
import {
	FieldTemplateDetailOptions,
	FieldTemplateDetails,
	TemplateRenderAs,
} from '../types/template.types'
import isIdWithVersion from '../utilities/isIdWithVersion'
import normaizeSchemaToIdWithVersion from '../utilities/normalizeSchemaToIdWithVersion'
import validateSchema from '../utilities/validateSchema'
import AbstractField from './AbstractField'
import {
	FieldDefinitionToSchemaOptions,
	ValidateOptions,
	ToValueTypeOptions,
	FieldDefinitionValueType,
} from './field.static.types'
import { SchemaFieldFieldDefinition } from './SchemaField.types'

export default class SchemaField<
	F extends SchemaFieldFieldDefinition = SchemaFieldFieldDefinition
> extends AbstractField<F> {
	public static get description() {
		return 'A way to map relationships.'
	}

	public static mapFieldDefinitionToSchemasOrIdsWithVersion(
		field: SchemaFieldFieldDefinition
	): (SchemaIdWithVersion | Schema)[] {
		const { options } = field
		const schemasOrIds: ({ version?: string; id: string } | Schema)[] = [
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
		field: SchemaFieldFieldDefinition
	): SchemaIdWithVersion[] {
		const schemasOrIds = this.mapFieldDefinitionToSchemasOrIdsWithVersion(field)

		const ids: SchemaIdWithVersion[] = schemasOrIds.map((item) =>
			normaizeSchemaToIdWithVersion(item)
		)

		return ids
	}

	public static generateTypeDetails() {
		return {
			valueTypeMapper:
				'SchemaFieldValueTypeMapper<F extends SchemaFieldFieldDefinition? F : SchemaFieldFieldDefinition, CreateEntityInstances>',
		}
	}

	public static generateTemplateDetails(
		options: FieldTemplateDetailOptions<SchemaFieldFieldDefinition>
	): FieldTemplateDetails {
		const { templateItems, renderAs, definition, globalNamespace } = options
		const { typeSuffix = '' } = definition.options

		const idsWithVersion =
			SchemaField.mapFieldDefinitionToSchemaIdsWithVersion(definition)
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
					valueType = `${matchedTemplateItem.nameCamel}Schema${
						matchedTemplateItem.schema.version
							? `_${matchedTemplateItem.schema.version}`
							: ''
					}`
				} else {
					valueType = `${globalNamespace}.${matchedTemplateItem.namespace}${
						version ? `.${version}` : ''
					}${
						renderAs === TemplateRenderAs.Type
							? `.${matchedTemplateItem.namePascal + typeSuffix}`
							: `.${matchedTemplateItem.namePascal}Schema`
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
		definition: SchemaFieldFieldDefinition,
		options?: FieldDefinitionToSchemaOptions
	): Schema[] {
		const { schemasById: schemasById = {} } = options || {}
		const schemasOrIds =
			SchemaField.mapFieldDefinitionToSchemasOrIdsWithVersion(definition)

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
		options?: ValidateOptions<SchemaFieldFieldDefinition>
	): InvalidFieldError[] {
		const errors = super.validate(value, options)

		// do not validate schemas by default, very heavy and only needed when explicitly asked to
		if (value instanceof AbstractEntity) {
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
					code: 'invalid_value',
					name: this.name,
					friendlyMessage: `${this.label ?? this.name} must be an object`,
				})
			} else {
				let schemas: Schema[] | undefined

				try {
					// pull schemas out of our own definition
					schemas = SchemaField.mapFieldDefinitionToSchemas(
						this.definition,
						options
					)
				} catch (err) {
					errors.push({
						code: 'invalid_value',
						name: this.name,
						error: err,
					})
				}

				if (schemas && schemas.length === 0) {
					errors.push({ code: 'missing_required', name: this.name })
				}

				// if we are validating schemas, we look them all up by id
				let instance: SchemaEntity | undefined

				if (schemas && schemas.length === 1) {
					// @ts-ignore warns about infinite recursion, which is true, because relationships between schemas can go forever
					instance = this.instantiateSchema(schemas[0], value)
				} else if (schemas && schemas.length > 0) {
					const { schemaId, version, values } = value || {}

					if (!values) {
						errors.push({
							name: this.name,
							code: 'invalid_value',
							friendlyMessage:
								'You need to add `values` to the value of ' + this.name,
						})
					} else if (!schemaId) {
						errors.push({
							name: this.name,
							code: 'invalid_value',
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
								code: 'invalid_value',
								friendlyMessage: `Could not find a schema by id '${schemaId}'${
									version ? ` and version '${version}'` : ' with no version'
								}.`,
							})
						} else {
							instance = this.instantiateSchema(matchSchema, values)
						}
					}
				}

				if (instance) {
					try {
						instance.validate()
					} catch (err) {
						errors.push({
							code: 'invalid_value',
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

	private instantiateSchema(schema: Schema, value: any): SchemaEntity {
		return schema.dynamicFieldSignature
			? new DynamicSchemaEntityImplementation(schema, value)
			: new StaticSchemaEntity(schema, value)
	}

	public toValueType<CreateEntityInstances extends boolean>(
		value: any,
		options?: ToValueTypeOptions<
			SchemaFieldFieldDefinition,
			CreateEntityInstances
		>
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
		const destinationSchemas: Schema[] =
			SchemaField.mapFieldDefinitionToSchemas(this.definition, { schemasById })

		const isUnion = destinationSchemas.length > 1
		let instance: SchemaEntity | undefined

		if (value instanceof AbstractEntity) {
			instance = value
		}
		// if we are only pointing 1 one possible definition, then mapping is pretty easy
		else if (!isUnion) {
			instance = this.instantiateSchema(destinationSchemas[0], value)
		} else {
			// this could be one of a few types, lets check the "schemaId" prop
			const { schemaId, values } = value
			const allMatches = destinationSchemas.filter((def) => def.id === schemaId)
			let matchedSchema: Schema | undefined

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

			instance = this.instantiateSchema(matchedSchema, values)
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
