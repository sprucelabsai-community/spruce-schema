import { IFieldDefinition } from './field.static.types'

export interface IDirectoryFieldValue {
	path: string
}

export type IDirectoryFieldDefinition = IFieldDefinition<
	IDirectoryFieldValue
> & {
	/** * .Directory - select whole directories all at once */
	type: 'directory'
	options?: {
		/** Will give you a path relative to this one, if possible */
		relativeTo?: string
	}
}
