import { FieldDefinition } from './field.static.types'

const supportedTypes = [
	'image/png',
	'image/jpeg',
	'application/pdf',
	'*',
] as const

export type SupportedFileType = typeof supportedTypes[number]

export interface FileFieldValue {
	name: string
	type?: SupportedFileType
	uri?: string
	base64?: string
}

export type FileFieldDefinition = FieldDefinition<FileFieldValue> & {
	/** * .File - a great way to deal with file management */
	type: 'file'
	options?: {
		acceptableTypes: SupportedFileType[]
	}
}
