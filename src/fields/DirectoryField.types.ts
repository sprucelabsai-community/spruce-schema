import { FieldDefinition } from './field.static.types'

export interface DirectoryFieldValue {
	path: string
}

export type DirectoryFieldDefinition = FieldDefinition<DirectoryFieldValue> & {
	/** * .Directory - select whole directories all at once */
	type: 'directory'
	options?: {
		/** Will give you a path relative to this one, if possible */
		relativeTo?: string
	}
}
