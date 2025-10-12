import { Schema } from '../../../../schemas.static.types'
import buildSchema from '../../../../utilities/buildSchema'

const schema: Schema = buildSchema({
    id: 'oneTextField',
    fields: {
        name: { type: 'text' },
    },
})

export default schema
