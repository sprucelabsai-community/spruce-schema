import { Schema } from '../../../../schemas.static.types'
import buildSchema from '../../../../utilities/buildSchema'

const schema: Schema = buildSchema({
    id: 'emptyWithNameAndDescription',
    name: 'This is my name',
    description: 'This is my description',
    fields: {},
})

export default schema
