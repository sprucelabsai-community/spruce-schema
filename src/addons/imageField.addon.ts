import ImageField from '../fields/ImageField'
import registerFieldType from '../utilities/registerFieldType'

export default registerFieldType({
	type: 'Image',
	class: ImageField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema',
})
