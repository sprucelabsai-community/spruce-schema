import { FieldDefinition } from './field.static.types'

export interface IFileFieldValue {
	/** Date last modified */
	lastModified?: Date
	/** The name of the file */
	name: string
	/** The size of the file if we are able to load it locally */
	size?: number
	/** The mime type of the file */
	type?: string
	/** The path to the file if local */
	path?: string
	/** The file extension */
	ext?: string
}

export type IFileFieldDefinition = FieldDefinition<IFileFieldValue> & {
	/** * .File - a great way to deal with file management */
	type: 'file'
	options?: {
		/** Which mime types are acceptable? */
		acceptableTypes?: string[]
		/** What is the biggest this file can be? */
		maxSize?: string
		/** All paths will be generated to this directory, if possible */
		relativeTo?: string
	}
}
