import registerFieldType from '../utilities/registerFieldType'
import { TextField } from '../fields'

export default registerFieldType({
	type: 'Text',
	class: TextField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema'
})
