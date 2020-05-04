import AbstractField from './AbstractField'
import { IFieldDefinition } from '../schema.types'
import { FieldType } from '#spruce:schema/fields/fieldType'
import pathUtil from 'path'
import Mime from 'mime-type'
import mimeDb from 'mime-db'
import { SchemaError } from '..'
import { ErrorCode, IInvalidFieldError } from '../errors/error.types'
import { IFieldTemplateDetailOptions } from '../template.types'

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

export type IFileFieldDefinition = IFieldDefinition<IFileFieldValue> & {
	/** * .File a great way to deal with file management */
	type: FieldType.File
	options?: {
		acceptableTypes?: string[]
		maxSize?: string
	}
}

export default class FileField extends AbstractField<IFileFieldDefinition> {
	public static get description() {
		return 'A way to handle files. Supports mime-type lookups.'
	}
	public static templateDetails(
		options: IFieldTemplateDetailOptions<IFileFieldDefinition>
	) {
		return {
			valueType: `IFileFieldValue${options.definition.isArray ? '[]' : ''}`
		}
	}

	public validate(value: any): IInvalidFieldError[] {
		try {
			this.toValueType(value)
			return []
		} catch (err) {
			return [{ code: 'invalid_file', name: this.name }]
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

		// Check if path is the full file path
		if (path && /\/[^/]+\.[^/]+$/.test(path)) {
			// If it is then we should just get the directory name and set it to path
			path = pathUtil.dirname(path)
		} else {
			path =
				stringValue.search(pathUtil.sep) > -1
					? pathUtil.dirname(stringValue)
					: undefined
		}

		name = name ?? stringValue.replace(path, '').replace(pathUtil.sep, '')
		if (!name) {
			throw new SchemaError({
				code: ErrorCode.TransformationFailed,
				fieldType: FieldType.File,
				incomingTypeof: typeof value,
				incomingValue: value,
				name: this.name
			})
		}
		ext = ext ?? pathUtil.extname(name)
		type = type ?? (mime.lookup(name) || undefined)

		return {
			name,
			path,
			type,
			ext
		}
	}
}
