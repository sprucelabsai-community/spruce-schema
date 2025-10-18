import { Schema } from '../../../../schemas.static.types'
import buildSchema from '../../../../utilities/buildSchema'

const schema: Schema = buildSchema({
    id: 'RawFields',
    fields: {
        contextAsRecordStringAny: {
            type: 'raw',
            options: {
                valueType: 'Record<string, any>',
            },
        },
        contextAsAny: {
            type: 'raw',
            options: {
                valueType: 'any',
            },
        },
    },
})

export default schema
