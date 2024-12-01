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

export default function normalizeSchemaValues<
    S extends Schema,
    F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
    PF extends SchemaPublicFieldNames<S> = SchemaPublicFieldNames<S>,
    CreateEntityInstances extends boolean = false,
    IncludePrivateFields extends boolean = true,
    IsDynamic extends boolean = IsDynamicSchema<S>,
    ShouldIncludeNullAndUndefinedFields extends boolean = true,
>(
    schema: S,
    values: ValuesWithPaths<SchemaPartialValues<S>>,
    options?: SchemaGetValuesOptions<
        S,
        F,
        PF,
        CreateEntityInstances,
        IncludePrivateFields,
        ShouldIncludeNullAndUndefinedFields
    >
) {
    const instance = EntityFactory.Entity<S, IsDynamic>(
        schema,
        expandValues(values)
    )

    const {
        shouldCreateEntityInstances = false,
        fields,
        shouldRetainDotSyntaxKeys,
        ...rest
    } = options || {}

    let areAnyKeysDotted = false
    let normalizedFields = fields?.map((f) => {
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

    const shouldConvertToDotSyntax =
        areAnyKeysDotted || shouldRetainDotSyntaxKeys

    if (shouldRetainDotSyntaxKeys || shouldConvertToDotSyntax) {
        const normalizedWithKeys: Record<string, any> = {}
        const keys = fields || Object.keys(values)

        for (const key of keys) {
            normalizedWithKeys[key] = get(normalized, key)
        }

        normalized = normalizedWithKeys
    }

    if (!shouldRetainDotSyntaxKeys && shouldConvertToDotSyntax) {
        normalized = expandValues(normalized)
    }

    return normalized as IsDynamic extends true
        ? DynamicSchemaAllValues<S, CreateEntityInstances>
        : IncludePrivateFields extends true
          ? Pick<
                SchemaValues<
                    S,
                    CreateEntityInstances,
                    true,
                    ShouldIncludeNullAndUndefinedFields
                >,
                F
            >
          : Pick<
                SchemaValues<
                    S,
                    CreateEntityInstances,
                    true,
                    ShouldIncludeNullAndUndefinedFields
                >,
                PF
            >
}

function expandValues(values: Record<string, any> = {}): Record<string, any> {
    const result: Record<string, any> = {}

    for (const key in values) {
        const value = values[key]
        const keys = key.split('.')

        let current = result

        for (let i = 0; i < keys.length; i++) {
            const k = keys[i]

            if (i === keys.length - 1) {
                current[k] = value
            } else {
                if (!(k in current) || typeof current[k] !== 'object') {
                    current[k] = {}
                }
                current = current[k]
            }
        }
    }

    return result
}
