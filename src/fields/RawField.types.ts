import { IFieldDefinition } from './field.static.types'

export type IRawFieldDefinition = IFieldDefinition<any> & {
	/** * .Raw - Deprecated, don't use */
	type: 'raw'
	options: {
		valueType: string
	}
}
