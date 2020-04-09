import registerFieldType from '../utilities/registerFieldType'
import { IdField } from '../fields'

export default registerFieldType({
	type: 'Id',
	class: IdField,
	package: '@sprucelabs/schema'
})
