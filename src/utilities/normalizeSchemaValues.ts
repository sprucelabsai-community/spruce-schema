import get from 'just-safe-get'
import EntityFactory from '../factories/SchemaEntityFactory'
import {
    Schema,
    SchemaPartialValues,
    SchemaGetValuesOptions,
    SchemaFieldNames,
    SchemaPublicFieldNames,
    IsDynamicSchema,
    DynamicSchemaAllValues,
    SchemaEntity,
    SchemaValues,
} from '../schemas.static.types'
import { ValuesWithPaths } from '../types/utilities.types'
import expandValues from './expandValues'

export default function normalizeSchemaValues<
    S extends Schema,
    F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
    PF extends SchemaPublicFieldNames<S> = SchemaPublicFieldNames<S>,
    CreateEntityInstances extends boolean = false,
    IncludePrivateFields extends boolean = true,
    IsDynamic extends boolean = IsDynamicSchema<S>,
    ShouldIncludeNullAndUndefinedFields extends boolean = true,
    ExcludeFields extends SchemaFieldNames<S> | undefined = undefined,
    PublicExcludeFields extends SchemaPublicFieldNames<S> | undefined =
        undefined,
>(
    schema: S,
    values: ValuesWithPaths<SchemaPartialValues<S>> | SchemaValues<S>,
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
) {
    const instance = EntityFactory.Entity<S, IsDynamic>(
        schema,
        expandValues(values)
    )

    const {
        shouldCreateEntityInstances = false,
        fields,
        shouldRetainDotNotationKeys,
        ...rest
    } = options || {}

    let areAnyKeysDotted = false
    const normalizedFields = fields?.map((f) => {
        const hasDotKey = f.includes('.')
        areAnyKeysDotted = areAnyKeysDotted || hasDotKey
        return hasDotKey ? (f.split('.')[0] as F) : f
    })

    const normalizedOptions = {
        shouldCreateEntityInstances,
        fields: normalizedFields,
        ...rest,
    } as any

    let normalized = (instance as SchemaEntity).getValues(normalizedOptions)

    const shouldConvertToDotNotation =
        areAnyKeysDotted || shouldRetainDotNotationKeys

    if (shouldRetainDotNotationKeys || shouldConvertToDotNotation) {
        const normalizedWithKeys: Record<string, any> = {}
        const keys = fields || Object.keys(values)

        for (const key of keys) {
            normalizedWithKeys[key] = get(normalized, key)
        }

        normalized = normalizedWithKeys
    }

    if (!shouldRetainDotNotationKeys && shouldConvertToDotNotation) {
        normalized = expandValues(normalized)
    }

    type AllValues = Pick<
        SchemaValues<
            S,
            CreateEntityInstances,
            true,
            ShouldIncludeNullAndUndefinedFields
        >,
        F
    >

    type PublicValues = Pick<
        SchemaValues<
            S,
            CreateEntityInstances,
            true,
            ShouldIncludeNullAndUndefinedFields
        >,
        PF
    >

    return normalized as IsDynamic extends true
        ? DynamicSchemaAllValues<S, CreateEntityInstances>
        : IncludePrivateFields extends true
          ? ExcludeFields extends SchemaFieldNames<S>
              ? Omit<AllValues, ExcludeFields>
              : AllValues
          : PublicExcludeFields extends SchemaFieldNames<S>
            ? Omit<PublicValues, PublicExcludeFields>
            : PublicValues
}
