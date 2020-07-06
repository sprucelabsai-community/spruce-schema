import { SchemaField } from '../fields'
import registerFieldType from '../utilities/registerFieldType'

export default registerFieldType({
	type: 'Schema',
	class: SchemaField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema',
})
