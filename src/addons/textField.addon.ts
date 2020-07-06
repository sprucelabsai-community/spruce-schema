import { TextField } from '../fields'
import registerFieldType from '../utilities/registerFieldType'

export default registerFieldType({
	type: 'Text',
	class: TextField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema',
})
