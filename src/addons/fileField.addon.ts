import registerFieldType from '../utilities/registerFieldType'
import { FileField } from '../fields'

export default registerFieldType({
	type: 'File',
	class: FileField,
	package: '@sprucelabs/schema'
})
