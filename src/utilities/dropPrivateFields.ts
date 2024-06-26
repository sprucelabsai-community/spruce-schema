import { FieldName } from '../fields/field.static.types'
import { SchemaFieldsByName } from '../schemas.static.types'

type PrivateFieldNames<F extends SchemaFieldsByName> = {
    [K in FieldName<F>]: F[K]['isPrivate'] extends true ? K : never
}[FieldName<F>]

export default function dropPrivateFields<
    F extends SchemaFieldsByName,
    D extends PrivateFieldNames<F>,
>(fields: F): Omit<F, D> {
    const optionalFields: Record<string, any> = {}

    Object.keys(fields).forEach((name) => {
        if (!fields[name].isPrivate) {
            optionalFields[name] = {
                ...fields[name],
            }
        }
    })

    return optionalFields as Omit<F, D>
}
