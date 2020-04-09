import registerFieldType from '../utilities/registerFieldType'
import { RawField } from '../fields'

export default registerFieldType({
	type: 'Raw',
	class: RawField,
	package: '@sprucelabs/schema'
})
