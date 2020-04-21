import registerFieldType from '../utilities/registerFieldType'
import { DurationField } from '../fields'

export default registerFieldType({
	type: 'Duration',
	class: DurationField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema'
})
