import { FieldDefinition } from './field.static.types'

export type RawFieldDefinition = FieldDefinition<any> & {
	type: 'raw'
	options: {
		valueType: string
	}
}
