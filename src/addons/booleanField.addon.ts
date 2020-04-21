import registerFieldType from '../utilities/registerFieldType'
import { BooleanField } from '../fields'

export default registerFieldType({
	type: 'Boolean',
	class: BooleanField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema'
})
