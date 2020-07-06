import { FileField } from '../fields'
import registerFieldType from '../utilities/registerFieldType'

export default registerFieldType({
	type: 'File',
	class: FileField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema',
})
