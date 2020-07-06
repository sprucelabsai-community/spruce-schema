import { DateTimeField } from '../fields'
import registerFieldType from '../utilities/registerFieldType'

export default registerFieldType({
	type: 'DateTime',
	class: DateTimeField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema',
})
