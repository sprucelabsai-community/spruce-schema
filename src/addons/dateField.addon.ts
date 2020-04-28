import registerFieldType from '../utilities/registerFieldType'
import { DateField } from '../fields'

export default registerFieldType({
	type: 'Date',
	class: DateField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema'
})
