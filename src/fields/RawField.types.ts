import { FieldDefinition } from './field.static.types'

export type IRawFieldDefinition = FieldDefinition<any> & {
	type: 'raw'
	options: {
		valueType: string
	}
}
