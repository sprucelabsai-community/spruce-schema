import registerFieldType from '../utilities/registerFieldType'
import { PhoneField } from '../fields'

export default registerFieldType({
	type: 'phone',
	class: PhoneField,
	package: '@sprucelabs/schema'
})
