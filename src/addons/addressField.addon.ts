import registerFieldType from '../utilities/registerFieldType'
import { AddressField } from '../fields'

export default registerFieldType({
	type: 'Address',
	class: AddressField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema'
})
