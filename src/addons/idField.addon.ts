import { IdField } from '../fields'
import registerFieldType from '../utilities/registerFieldType'

export default registerFieldType({
	type: 'Id',
	class: IdField,
	package: '@sprucelabs/schema',
	importAs: 'SpruceSchema'
})
