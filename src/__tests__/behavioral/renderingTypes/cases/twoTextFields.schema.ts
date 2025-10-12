import { Schema } from '../../../../schemas.static.types'
import buildSchema from '../../../../utilities/buildSchema'

const schema: Schema = buildSchema({
    id: 'twoTextFields',
    fields: {
        firstName: { type: 'text' },
        lastName: { type: 'text' },
    },
})

export default schema
