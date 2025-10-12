import { Schema } from '../../../../schemas.static.types'
import buildSchema from '../../../../utilities/buildSchema'

const schema: Schema = buildSchema({
    id: 'emptyWithName',
    name: 'Empty with name',
    fields: {},
})

export default schema
