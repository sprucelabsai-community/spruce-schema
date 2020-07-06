import { NumberField } from '../fields'
import registerFieldType from '../utilities/registerFieldType'

export default registerFieldType({
	type: 'Number',
	class: NumberField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema',
})
