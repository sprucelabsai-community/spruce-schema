import { DateField } from '../fields'
import registerFieldType from '../utilities/registerFieldType'

export default registerFieldType({
	type: 'Date',
	class: DateField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema'
})
