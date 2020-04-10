import registerFieldType from '../utilities/registerFieldType'
import { NumberField } from '../fields'

export default registerFieldType({
	type: 'Number',
	class: NumberField,
	package: '@sprucelabs/schema'
})
