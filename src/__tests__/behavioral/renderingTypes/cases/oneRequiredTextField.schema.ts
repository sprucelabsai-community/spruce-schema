import { Schema } from '../../../../schemas.static.types'
import buildSchema from '../../../../utilities/buildSchema'

const schema: Schema = buildSchema({
    id: 'oneRequiredTextField',
    fields: {
        name: { type: 'text', isRequired: true },
    },
})

export default schema
