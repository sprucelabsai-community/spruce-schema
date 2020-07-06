import { AddressField } from '../fields'
import registerFieldType from '../utilities/registerFieldType'

export default registerFieldType({
	type: 'Address',
	class: AddressField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema',
})
