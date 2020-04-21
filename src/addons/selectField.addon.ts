import registerFieldType from '../utilities/registerFieldType'
import { SelectField } from '../fields'

export default registerFieldType({
	type: 'Select',
	class: SelectField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema'
})
