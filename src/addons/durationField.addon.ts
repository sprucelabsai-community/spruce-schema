import { DurationField } from '../fields'
import registerFieldType from '../utilities/registerFieldType'

export default registerFieldType({
	type: 'Duration',
	class: DurationField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema',
})
