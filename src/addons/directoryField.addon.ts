import { DirectoryField } from '../fields'
import registerFieldType from '../utilities/registerFieldType'

export default registerFieldType({
	type: 'Directory',
	class: DirectoryField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema',
})
