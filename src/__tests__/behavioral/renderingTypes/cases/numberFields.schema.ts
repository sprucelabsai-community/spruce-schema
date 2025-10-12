import { Schema } from '../../../../schemas.static.types'
import buildSchema from '../../../../utilities/buildSchema'

const schema: Schema = buildSchema({
    id: 'numberFields',
    fields: {
        age: { type: 'number' },
        luckyNumbers: {
            type: 'number',
            isArray: true,
            minArrayLength: 1,
            isRequired: true,
            options: {
                min: -5,
                max: 2,
            },
        },
        unluckyNumbers: {
            type: 'number',
            isArray: true,
            minArrayLength: 3,
            options: {
                min: -10,
                max: 10,
            },
        },
    },
})

export default schema
