import registerFieldType from '../utilities/registerFieldType'
import { DirectoryField } from '../fields'

export default registerFieldType({
	type: 'Directory',
	class: DirectoryField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema'
})
