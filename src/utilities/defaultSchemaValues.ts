import {
    SchemaDefaultValues,
    Schema,
    SchemaGetDefaultValuesOptions,
    SchemaFieldNamesWithDefaultValue,
} from '../schemas.static.types'
import StaticSchemaEntityImpl from '../StaticSchemaEntityImpl'

export default function defaultSchemaValues<
    S extends Schema,
    F extends SchemaFieldNamesWithDefaultValue<S> =
        SchemaFieldNamesWithDefaultValue<S>,
    CreateEntityInstances extends boolean = true,
>(
    definition: S,
    options: SchemaGetDefaultValuesOptions<S, F, CreateEntityInstances> = {}
): SchemaDefaultValues<S> {
    const instance = new StaticSchemaEntityImpl(definition)

    // @ts-ignore
    return instance.getDefaultValues({
        shouldCreateEntityInstances: false,
        ...options,
    })
}
