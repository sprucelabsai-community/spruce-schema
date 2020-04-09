import registerFieldType from '../utilities/registerFieldType'
import { SchemaField } from '../fields'

export default registerFieldType({
	type: 'Schema',
	class: SchemaField,
	package: '@sprucelabs/schema'
})
