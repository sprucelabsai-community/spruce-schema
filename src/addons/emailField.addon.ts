import EmailField from '../fields/EmailField'
import registerFieldType from '../utilities/registerFieldType'

export default registerFieldType({
	type: 'Email',
	class: EmailField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema',
})
