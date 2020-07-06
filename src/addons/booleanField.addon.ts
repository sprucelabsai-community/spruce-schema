import { BooleanField } from '../fields'
import registerFieldType from '../utilities/registerFieldType'

export default registerFieldType({
	type: 'Boolean',
	class: BooleanField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema',
})
