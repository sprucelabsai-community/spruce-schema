import AbstractEntity from './AbstractEntity'
import { FieldError } from './errors/options.types'
import SpruceError from './errors/SpruceError'
import FieldFactory from './factories/FieldFactory'
import {
    Schema,
    StaticSchemaPartialValues,
    SchemaFields,
    SchemaFieldNames,
    SchemaNormalizeOptions,
    SchemaFieldValueType,
    SchemaValidateOptions,
    SchemaDefaultValues,
    SchemaGetValuesOptions,
    SchemaAllValues,
    SchemaNamedFieldsOptions,
    SchemaNamedField,
    SchemaGetDefaultValuesOptions,
    SchemaFieldNamesWithDefaultValue,
    StaticSchemaEntity,
    SchemaPublicValues,
    SchemaPublicFieldNames,
} from './schemas.static.types'
import cloneDeepPreservingInstances from './utilities/cloneDeepPreservingInstances'
import normalizeFieldValue, {
    normalizeValueToArray,
} from './utilities/normalizeFieldValue'

export default class StaticSchemaEntityImpl<S extends Schema>
    extends AbstractEntity
    implements StaticSchemaEntity<S>
{
    public static enableDuplicateCheckWhenTracking = true

    protected schema: S
    private values: StaticSchemaPartialValues<S> = {}
    private fields: SchemaFields<S>

    public constructor(schema: S, values?: StaticSchemaPartialValues<S>) {
        super(schema)

        this.schema = schema
        this.fields = {} as SchemaFields<S>
        this.buildFields()

        const v = {
            ...this.values,
            ...values,
        }
        this.values = cloneDeepPreservingInstances(v)
    }

    private buildFields() {
        const fieldDefinitions = this.schema.fields
        if (!fieldDefinitions) {
            throw new Error(
                `SchemaEntity requires fields. If you want to use dynamicFieldSignature, try DynamicSchemaEntity.`
            )
        }

        Object.keys(fieldDefinitions).forEach((name) => {
            const definition = fieldDefinitions[name]
            const field = FieldFactory.Field(name, definition)

            this.fields[name as SchemaFieldNames<S>] = field as any

            if (definition.value) {
                this.set(name as SchemaFieldNames<S>, definition.value)
            }
        })
    }

    private normalizeValue<
        F extends SchemaFieldNames<S>,
        CreateEntityInstances extends boolean = true,
    >(
        forField: F,
        value: any,
        options?: SchemaNormalizeOptions<S, CreateEntityInstances>
    ): SchemaFieldValueType<S, F, CreateEntityInstances> {
        const field = this.fields[forField]

        const overrideOptions = {
            ...(options ?? {}),
            ...(options?.byField?.[forField] ?? {}),
        }

        return normalizeFieldValue(
            this.schemaId,
            this.name,
            {},
            field,
            value,
            overrideOptions
        )
    }

    public get<
        F extends SchemaFieldNames<S>,
        CreateEntityInstances extends boolean = true,
    >(
        fieldName: F,
        options: SchemaNormalizeOptions<S, CreateEntityInstances> = {}
    ): SchemaFieldValueType<S, F, CreateEntityInstances, true> {
        const value: SchemaFieldValueType<S, F> | undefined | null =
            this.values[fieldName] !== undefined
                ? this.values[fieldName]
                : undefined

        return this.normalizeValue(fieldName, value, options)
    }

    public set<F extends SchemaFieldNames<S>>(
        fieldName: F,
        value: SchemaFieldValueType<S, F>,
        options: SchemaNormalizeOptions<S, false> = {}
    ): this {
        const localValue = this.normalizeValue(fieldName, value, options)

        this.values[fieldName] = localValue

        return this
    }

    public isValid(options: SchemaValidateOptions<S> = {}) {
        try {
            this.validate(options)
            return true
        } catch {
            return false
        }
    }

    private pluckExtraFields(values: StaticSchemaPartialValues<S>, schema: S) {
        const extraFields: string[] = []
        if (schema.fields) {
            const passedFields = Object.keys(values)
            const expectedFields = Object.keys(schema.fields)

            passedFields.forEach((passed) => {
                if (expectedFields.indexOf(passed) === -1) {
                    extraFields.push(passed)
                }
            })
        }
        return extraFields
    }

    public validate(options: SchemaValidateOptions<S> = {}) {
        const errors: FieldError[] = []

        const extraFields: string[] = this.pluckExtraFields(
            this.values,
            this.schema
        )

        if (extraFields.length > 0) {
            extraFields.forEach((name) => {
                errors.push({
                    name,
                    code: 'UNEXPECTED_PARAMETER',
                    friendlyMessage: `\`${name}\` does not exist.`,
                })
            })
        }

        this.getNamedFields(options).forEach((namedField) => {
            const { name, field } = namedField
            let valueAsArray = normalizeValueToArray(this.values[name])

            if (
                field.isRequired &&
                field.isArray &&
                (!this.values[name] ||
                    valueAsArray.length < (field.minArrayLength ?? 1))
            ) {
                errors.push({
                    code: !this.values[name]
                        ? 'MISSING_PARAMETER'
                        : 'INVALID_PARAMETER',
                    name,
                    friendlyMessage: !this.values[name]
                        ? `${field.label ? `'${field.label}'` : 'This'} is required!`
                        : `${field.label ? `'${field.label}'` : 'You'} must ${field.label ? 'have' : 'select'} at least ${
                              field.minArrayLength
                          } value${field.minArrayLength === 1 ? '' : 's'}. I found ${
                              valueAsArray.length
                          }!`,
                })
            } else {
                if (
                    (!field.isArray || (field.minArrayLength ?? 0) > 0) &&
                    valueAsArray.length === 0
                ) {
                    valueAsArray = [undefined]
                }

                for (const value of valueAsArray) {
                    const fieldErrors = field.validate(value, {
                        schemasById: {},
                    })

                    if (fieldErrors.length > 0) {
                        errors.push(...fieldErrors)
                    }
                }
            }
        })

        if (errors.length > 0) {
            throw new SpruceError({
                code: 'VALIDATION_FAILED',
                schemaId: this.schemaId,
                schemaName: this.name,
                errors,
            })
        }
    }

    public getDefaultValues<
        F extends
            SchemaFieldNamesWithDefaultValue<S> = SchemaFieldNamesWithDefaultValue<S>,
        CreateEntityInstances extends boolean = true,
    >(
        options: SchemaGetDefaultValuesOptions<S, F, CreateEntityInstances> = {}
    ): Pick<SchemaDefaultValues<S, CreateEntityInstances>, F> {
        const values: Partial<SchemaDefaultValues<S>> = {}

        this.getNamedFields().forEach((namedField) => {
            const { name, field } = namedField
            if (typeof field.definition.defaultValue !== 'undefined') {
                // @ts-ignore
                values[name] = this.normalizeValue(
                    name,
                    field.definition.defaultValue,
                    options
                )
            }
        })
        return values as any
    }

    public getValues<
        F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
        PF extends SchemaPublicFieldNames<S> = SchemaPublicFieldNames<S>,
        CreateEntityInstances extends boolean = true,
        IncludePrivateFields extends boolean = true,
        ShouldIncludeNullAndUndefinedFields extends boolean = true,
        ExcludeFields extends SchemaFieldNames<S> | undefined = undefined,
        PublicExcludeFields extends
            | SchemaPublicFieldNames<S>
            | undefined = undefined,
    >(
        options?: SchemaGetValuesOptions<
            S,
            F,
            PF,
            CreateEntityInstances,
            IncludePrivateFields,
            ShouldIncludeNullAndUndefinedFields,
            ExcludeFields,
            PublicExcludeFields
        >
    ): IncludePrivateFields extends false
        ? Pick<SchemaPublicValues<S, CreateEntityInstances>, PF>
        : Pick<SchemaAllValues<S, CreateEntityInstances>, F> {
        const values: StaticSchemaPartialValues<S, CreateEntityInstances> = {}

        let {
            fields = Object.keys(this.fields),
            shouldIncludePrivateFields: includePrivateFields = true,
            shouldIncludeNullAndUndefinedFields = true,
            excludeFields,
        } = options || {}

        this.getNamedFields().forEach((namedField) => {
            const { name, field } = namedField

            const shouldSkipBecauseNotSet =
                !shouldIncludeNullAndUndefinedFields && !(name in this.values)

            const shouldSkipBecauseUndefinedOrNull =
                !shouldIncludeNullAndUndefinedFields &&
                (this.values[name] === undefined || this.values[name] === null)

            const shouldSkipBecauseExcluded = excludeFields?.includes(
                name as ExcludeFields & PublicExcludeFields
            )

            if (
                shouldSkipBecauseNotSet ||
                shouldSkipBecauseUndefinedOrNull ||
                shouldSkipBecauseExcluded
            ) {
                return
            }

            if (
                fields.indexOf(name) > -1 &&
                (includePrivateFields || !field.isPrivate)
            ) {
                const value = this.get(
                    name,
                    options as SchemaNormalizeOptions<S, CreateEntityInstances>
                )
                values[name] = value
            }
        })

        return values as IncludePrivateFields extends false
            ? Pick<SchemaPublicValues<S, CreateEntityInstances>, PF>
            : Pick<SchemaAllValues<S, CreateEntityInstances>, F>
    }

    public setValues(values: StaticSchemaPartialValues<S>): this {
        this.getNamedFields().forEach((namedField) => {
            const { name } = namedField
            const value = values[name]
            if (typeof value !== 'undefined') {
                this.set(name, value as any)
            }
        })

        return this
    }

    public getNamedFields<F extends SchemaFieldNames<S>>(
        options: SchemaNamedFieldsOptions<S, F> = {}
    ): SchemaNamedField<S>[] {
        const namedFields: SchemaNamedField<S>[] = []
        const { fields = Object.keys(this.fields) as F[] } = options

        fields.forEach((name) => {
            const field = this.fields[name]
            namedFields.push({ name, field })
        })

        return namedFields
    }
}
