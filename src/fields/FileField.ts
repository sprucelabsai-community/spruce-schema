import AbstractField, { IFieldDefinition } from './AbstractField'
import { FieldType } from '#spruce:fieldTypes'

export interface IFileFieldValue {
	lastModified?: number
	name: string
	size?: number
	type: string
}

export interface IFileFieldDefinition extends IFieldDefinition {
	/** * .File - select a file or directory */
	type: FieldType.File
	value?: IFileFieldValue
	defaultValue?: IFileFieldValue
	options?: {}
}

export default class FileField extends AbstractField<IFileFieldDefinition> {
	public static templateDetails() {
		return {
			valueType: 'IFileFieldValue'
		}
	}
}
