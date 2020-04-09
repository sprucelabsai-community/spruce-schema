import registerFieldType from '../utilities/registerFieldType'
import { DateTimeField } from '../fields'

export default registerFieldType({
	type: 'DateTime',
	class: DateTimeField,
	package: '@sprucelabs/schema'
})
