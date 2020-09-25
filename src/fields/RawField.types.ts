import { IFieldDefinition } from './field.static.types'

export type IRawFieldDefinition = IFieldDefinition<any> & {
	type: 'raw'
	options: {
		valueType: string
	}
}
