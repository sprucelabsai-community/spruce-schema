import { IBaseFieldDefinition } from './BaseField'
import { FieldType } from './types'
import { BaseField } from '.'

export interface IFileFieldValue {
	lastModified?: number
	name: string
	size?: number
	type: string
}

export interface IFileFieldDefinition extends IBaseFieldDefinition {
	/** * .File - select a file or directory */
	type: FieldType.File
}

export default class FileField extends BaseField<IFileFieldDefinition> {
	public static templateDetails() {
		return {
			definitionInterface: 'IFileDefinition',
			valueType: 'IFileFieldValue'
		}
	}
}
