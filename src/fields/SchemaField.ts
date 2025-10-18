import AbstractEntity from '../AbstractEntity'
import { FieldError } from '../errors/options.types'
import SpruceError from '../errors/SpruceError'
import {
    Schema,
    SchemaIdWithVersion,
    SchemaEntity,
} from '../schemas.static.types'
import SchemaRegistry from '../singletons/SchemaRegistry'
import {
    FieldTemplateDetailOptions,
    FieldTemplateDetails,
    SchemaTemplateItem,
    TemplateRenderAs,
} from '../types/template.types'
import isIdWithVersion from '../utilities/isIdWithVersion'
import normalizeSchemaToIdWithVersion from '../utilities/normalizeSchemaToIdWithVersion'
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
    F extends SchemaFieldFieldDefinition = SchemaFieldFieldDefinition,
> extends AbstractField<F> {
    public static readonly description = 'A way to map relationships.'

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
            } catch (err: any) {
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
        const schemasOrIds =
            this.mapFieldDefinitionToSchemasOrIdsWithVersion(field)

        const ids: SchemaIdWithVersion[] = schemasOrIds.map((item) =>
            normalizeSchemaToIdWithVersion(item)
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
        const {
            templateItems,
            renderAs,
            definition,
            globalNamespace,
            language,
        } = options

        const { isArray } = definition
        const { typeSuffix = '' } = definition.options

        const idsWithVersion =
            this.mapFieldDefinitionToSchemaIdsWithVersion(definition)
        const unions: { schemaId: string; valueType: string }[] = []

        idsWithVersion.forEach((idWithVersion) => {
            const { version } = idWithVersion
            const { namePascal, namespace, id, nameCamel, schema } =
                this.findSchemaInTemplateItems(idWithVersion, templateItems)

            let valueType: string | undefined
            if (language === 'go') {
                valueType = `${namespace}${namePascal}`
            } else if (renderAs === TemplateRenderAs.Value) {
                valueType = `${nameCamel}Schema${
                    schema.version ? `_${schema.version}` : ''
                }`
            } else {
                valueType = `${globalNamespace}.${namespace}${
                    version ? `.${version}` : ''
                }${
                    renderAs === TemplateRenderAs.Type
                        ? `.${namePascal + typeSuffix}`
                        : `.${namePascal}Schema`
                }`

                if (
                    renderAs === TemplateRenderAs.Type &&
                    idsWithVersion.length > 1
                ) {
                    valueType = `{ id: '${id}', values: ${valueType} }`
                }
            }

            unions.push({
                schemaId: id,
                valueType,
            })
        })

        let valueType
        if (renderAs === TemplateRenderAs.Value) {
            valueType =
                unions.length === 1
                    ? unions[0].valueType
                    : '[' +
                      unions.map((item) => item.valueType).join(', ') +
                      ']'
        } else {
            valueType = unions.map((item) => item.valueType).join(' | ')

            const shouldRenderAsArray =
                (isArray && renderAs === TemplateRenderAs.Type) ||
                (unions.length > 1 && renderAs === TemplateRenderAs.SchemaType)

            const arrayNotation = shouldRenderAsArray ? '[]' : ''

            if (language === 'go') {
                valueType = `*${arrayNotation}${valueType}`
            } else {
                valueType = `${
                    shouldRenderAsArray && unions.length > 1
                        ? `(${valueType})`
                        : `${valueType}`
                }${arrayNotation}`
            }
        }

        return {
            valueType,
        }
    }

    private static findSchemaInTemplateItems(
        idWithVersion: SchemaIdWithVersion,
        templateItems: SchemaTemplateItem[]
    ) {
        const { id, namespace, version } = idWithVersion

        let allMatches = templateItems.filter((item) => {
            if (!item.id) {
                throwInvalidReferenceError(item)
            }
            return item.id.toLowerCase() === id.toLowerCase()
        })

        if (namespace) {
            allMatches = allMatches.filter((item) => {
                if (!item.namespace) {
                    throwInvalidReferenceError(item)
                }
                return item.namespace.toLowerCase() === namespace.toLowerCase()
            })
        }

        if (allMatches.length === 0) {
            throw new SpruceError({
                code: 'SCHEMA_NOT_FOUND',
                schemaId: id,
                friendlyMessage: `Template generation failed. I could not find a schema that was being referenced. I was looking for a schema with the id of '${id}' and namespace '${
                    namespace ?? '**missing**'
                }'.`,
            })
        }

        let matchedTemplateItem

        matchedTemplateItem = allMatches.find(
            (d) => d.schema.version === version
        )

        if (!matchedTemplateItem) {
            throw new SpruceError({
                code: 'VERSION_NOT_FOUND',
                schemaId: id,
            })
        }
        return matchedTemplateItem
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
    ): FieldError[] {
        const errors = super.validate(value, options)

        // do not validate schemas by default, very heavy and only needed when explicitly asked to
        if (value instanceof AbstractEntity) {
            try {
                value.validate()
                return []
            } catch (err: any) {
                errors.push({
                    originalError: err,
                    errors: err.options.errors,
                    code: 'INVALID_PARAMETER',
                    name: this.name,
                })
            }
        }

        if (errors.length === 0 && value) {
            if (typeof value !== 'object') {
                errors.push({
                    code: 'INVALID_PARAMETER',
                    name: this.name,
                    friendlyMessage: `${this.label ?? this.name} must be an object!`,
                })
            } else {
                let schemas: Schema[] | undefined

                try {
                    // pull schemas out of our own definition
                    schemas = SchemaField.mapFieldDefinitionToSchemas(
                        this.definition,
                        options
                    )
                } catch (err: any) {
                    errors.push({
                        code: 'INVALID_PARAMETER',
                        name: this.name,
                        originalError: err,
                        friendlyMessage: err.message,
                    })
                }

                if (schemas && schemas.length === 0) {
                    errors.push({ code: 'MISSING_PARAMETER', name: this.name })
                }

                // if we are validating schemas, we look them all up by id
                let instance: SchemaEntity | undefined

                if (schemas && schemas.length === 1) {
                    // @ts-ignore warns about infinite recursion, which is true, because relationships between schemas can go forever
                    instance = this.Schema(schemas[0], value)
                } else if (schemas && schemas.length > 0) {
                    const { id, version, values } = value || {}

                    if (!values) {
                        errors.push({
                            name: this.name,
                            label: this.label,
                            code: 'INVALID_PARAMETER',
                            friendlyMessage:
                                'You need to add `values` to the value of ' +
                                this.name,
                        })
                    } else if (!id) {
                        errors.push({
                            name: this.name,
                            label: this.label,
                            code: 'INVALID_PARAMETER',
                            friendlyMessage:
                                'You need to add `id` to the value of ' +
                                this.name,
                        })
                    } else {
                        const matches = schemas.filter(
                            (schema) =>
                                schema.id === id &&
                                (!version || schema.version === version)
                        )
                        if (matches.length !== 1) {
                            errors.push({
                                name: this.name,
                                label: this.label,
                                code: 'INVALID_PARAMETER',
                                friendlyMessage: `Could not find a schema by id '${id}'${
                                    version
                                        ? ` and version '${version}'`
                                        : ' with no version. Try adding a version to disambiguate.'
                                }.`,
                            })
                        } else {
                            instance = this.Schema(matches[0], values)
                        }
                    }
                }

                if (instance) {
                    try {
                        instance.validate()
                    } catch (err: any) {
                        errors.push({
                            code: 'INVALID_PARAMETER',
                            errors: err.options.errors,
                            name: this.name,
                            originalError: err,
                            label: this.label,
                        })
                    }
                }
            }
        }

        return errors
    }

    private Schema(schema: Schema, value: any): SchemaEntity {
        const Class = schema.dynamicFieldSignature
            ? require('../DynamicSchemaEntityImplementation').default
            : require('../StaticSchemaEntityImpl').default

        return new Class(schema, value)
    }

    public toValueType<CreateEntityInstances extends boolean>(
        value: any,
        options?: ToValueTypeOptions<
            SchemaFieldFieldDefinition,
            CreateEntityInstances
        >
    ): FieldDefinitionValueType<F, CreateEntityInstances> {
        const { createEntityInstances, schemasById: schemasById = {} } =
            options || {}

        // try and pull the schema definition from the options and by id
        const destinationSchemas: Schema[] =
            SchemaField.mapFieldDefinitionToSchemas(this.definition, {
                schemasById,
            })

        const isUnion = destinationSchemas.length > 1
        let instance: SchemaEntity | undefined

        if (value instanceof AbstractEntity) {
            instance = value
        }
        // if we are only pointing 1 one possible definition, then mapping is pretty easy
        else if (!isUnion) {
            instance = this.Schema(destinationSchemas[0], value)
        } else {
            // this could be one of a few types, lets check the "schemaId" prop
            const { id, values } = value
            const allMatches = destinationSchemas.filter((def) => def.id === id)
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
                        schemaId: id,
                    })
                }
            } else {
                matchedSchema = allMatches[0]
            }

            instance = this.Schema(matchedSchema, values)
        }

        if (createEntityInstances) {
            return instance as FieldDefinitionValueType<
                F,
                CreateEntityInstances
            >
        }

        const getValueOptions = {
            validate: false,
            ...options,
            fields: undefined,
        }

        if (isUnion) {
            return {
                id: instance.schemaId,
                values: instance.getValues(getValueOptions),
            } as FieldDefinitionValueType<F, CreateEntityInstances>
        }

        return instance.getValues(getValueOptions) as FieldDefinitionValueType<
            F,
            CreateEntityInstances
        >
    }
}
function throwInvalidReferenceError(item: SchemaTemplateItem) {
    throw new SpruceError({
        code: 'INVALID_SCHEMA_REFERENCE',
        friendlyMessage: `Generating template failed because one of your schema references (the schema a field with 'type=schema' points to) is missing a namespace. Look through your builders for a field pointing to something like:\n\n${JSON.stringify(
            item,
            null,
            2
        )}`,
    })
}
