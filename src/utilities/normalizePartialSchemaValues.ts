import {
    Schema,
    SchemaPartialValues,
    SchemaGetValuesOptions,
    SchemaFieldNames,
    SchemaPublicFieldNames,
    SchemaValues,
} from '../schemas.static.types'
import { ValuesWithPaths } from '../types/utilities.types'
import normalizeSchemaValues from './normalizeSchemaValues'

export default function normalizePartialSchemaValues<
    S extends Schema,
    F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
    PF extends SchemaPublicFieldNames<S> = SchemaPublicFieldNames<S>,
    CreateEntityInstances extends boolean = false,
    IncludePrivateFields extends boolean = true,
    Values extends SchemaPartialValues<S, CreateEntityInstances> =
        SchemaPartialValues<S, CreateEntityInstances>,
    IValuesWithPaths extends ValuesWithPaths<Values> = ValuesWithPaths<Values>,
    Fields extends keyof IValuesWithPaths = keyof IValuesWithPaths,
>(
    schema: S,
    values: IValuesWithPaths,
    options?: SchemaGetValuesOptions<
        S,
        F,
        PF,
        CreateEntityInstances,
        IncludePrivateFields
    >
) {
    //@ts-ignore
    const normalized = normalizeSchemaValues(schema, values, {
        ...options,
        shouldIncludeNullAndUndefinedFields: false,
    } as any)

    return normalized as unknown as Required<
        Pick<
            SchemaValues<S, CreateEntityInstances>,
            /** @ts-ignore */
            Fields
        >
    >
}
