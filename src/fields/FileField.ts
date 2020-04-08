import AbstractField, { IFieldDefinition } from './AbstractField'
import { FieldType } from './types'

export interface IFileFieldValue {
	lastModified?: number
	name: string
	size?: number
	type: string
}

export interface IFileFieldDefinition extends IFieldDefinition {
	/** * .File - select a file or directory */
	type: FieldType.File
}

export default class FileField extends AbstractField<IFileFieldDefinition> {
	public static templateDetails() {
		return {
			valueType: 'IFileFieldValue'
		}
	}
}
