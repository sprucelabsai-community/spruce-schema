import { Schema } from '../../../../schemas.static.types'
import buildSchema from '../../../../utilities/buildSchema'

const schema: Schema = buildSchema({
    id: 'oneArrayTextField',
    fields: {
        names: { type: 'text', isArray: true },
    },
})

export default schema
