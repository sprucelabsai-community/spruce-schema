import AbstractField, { IFieldDefinition } from './AbstractField'
import { FieldType } from '#spruce:schema/fields/fieldType'
import pathUtil from 'path'
import Mime from 'mime-type'
import mimeDb from 'mime-db'
import { SchemaError } from '..'
import { SchemaErrorCode } from '../errors/types'

// TODO better mime checking
// @ts-ignore
const mime = new Mime(mimeDb, 2)
mime.define('application/typescript', { extensions: ['ts', 'tsx'] })

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

export interface IFileFieldDefinition extends IFieldDefinition {
	/** * .File - select a file or directory */
	type: FieldType.File
	value?: IFileFieldValue
	defaultValue?: Partial<IFileFieldValue>
	options?: {
		acceptableTypes?: string[]
		maxSize?: string
	}
}

export default class FileField extends AbstractField<IFileFieldDefinition> {
	public static templateDetails() {
		return {
			valueType: 'IFileFieldValue'
		}
	}

	public validate(value: any): string[] {
		const { options = {} } = this.definition
		try {
			const file = this.toValueType(value)
			console.log(file, options)
			return []
		} catch (err) {
			return ['invalid_file']
		}
	}

	/** Take a range of possible values and transform it into a IFileFieldValue */
	public toValueType(value: any): IFileFieldValue {
		let stringValue =
			typeof value === 'string' || value.toString ? value.toString() : undefined
		let path: string | undefined
		let name: string | undefined
		let ext: string | undefined
		let type: string | undefined

		if (typeof value === 'object') {
			path = typeof value.path === 'string' ? value.path : undefined
			name = typeof value.name === 'string' ? value.name : undefined
			ext = typeof value.ext === 'string' ? value.ext : undefined
			type = typeof value.type === 'string' ? value.type : undefined

			// Use the name, fallback to path for looking up additional details
			stringValue = name || path
		}

		path =
			path ?? stringValue.search(pathUtil.sep) > -1
				? pathUtil.dirname(stringValue)
				: undefined
		name = name ?? stringValue.replace(path, '').replace(pathUtil.sep, '')
		ext = ext ?? pathUtil.extname(stringValue)
		type = type ?? (mime.lookup(stringValue) || undefined)

		if (!name) {
			throw new SchemaError({
				code: SchemaErrorCode.TransformationFailed,
				fieldType: FieldType.File,
				incomingTypeof: typeof value,
				incomingValue: value
			})
		}
		return {
			name,
			path,
			type,
			ext
		}
	}
}
