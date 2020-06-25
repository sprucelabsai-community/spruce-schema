import { PhoneField } from '../fields'
import registerFieldType from '../utilities/registerFieldType'

export default registerFieldType({
	type: 'phone',
	class: PhoneField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema'
})
