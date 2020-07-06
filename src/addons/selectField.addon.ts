import { SelectField } from '../fields'
import registerFieldType from '../utilities/registerFieldType'

export default registerFieldType({
	type: 'Select',
	class: SelectField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema',
})
