import { Schema } from '../../../../schemas.static.types'
import buildSchema from '../../../../utilities/buildSchema'

const schema: Schema = buildSchema({
    id: 'fieldsWithHints',
    description: 'A schema with fields that have hints',
    fields: {
        middleName: { type: 'text', hint: 'this is the first hint' },
        title: { type: 'text', hint: 'this is the second hint' },
    },
})

export default schema
