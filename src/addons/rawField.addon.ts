import { RawField } from '../fields'
import registerFieldType from '../utilities/registerFieldType'

export default registerFieldType({
	type: 'Raw',
	class: RawField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema'
})
