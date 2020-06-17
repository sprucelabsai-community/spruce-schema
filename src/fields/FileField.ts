import AbstractField from './AbstractField'
import {
	IFieldDefinition,
	ToValueTypeOptions,
	ValidateOptions
} from '../schema.types'
import FieldType from '#spruce:schema/fields/fieldType'
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
	/** * .File - a great way to deal with file management */
	type: FieldType.File
	options?: {
		/** Which mime types are acceptable? */
		acceptableTypes?: string[]
		/** What is the biggest this file can be? */
		maxSize?: string
		/** All paths will be generated to this directory, if possible */
		relativeTo?: string
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
			valueType: `${options.importAs}.IFileFieldValue${
				options.definition.isArray ? '[]' : ''
			}`
		}
	}

	public validate(
		value: any,
		_?: ValidateOptions<IFileFieldDefinition>
	): IInvalidFieldError[] {
		const errors: IInvalidFieldError[] = []
		try {
			const file = this.toValueType(value)
			if (!file.ext && file.path) {
				// eslint-disable-next-line @typescript-eslint/no-var-requires
				const fsUtil = require('fs')
				// if this file has no extension, lets see if it's a directory
				const isDirExists =
					fsUtil.existsSync(file.path) &&
					fsUtil.lstatSync(file.path).isDirectory()

				if (isDirExists) {
					errors.push({ code: 'is_directory_not_file', name: this.name })
				}
			}
		} catch (err) {
			errors.push({ code: 'invalid_file', name: this.name })
		}

		return errors
	}

	/** Take a range of possible values and transform it into a IFileFieldValue */
	public toValueType<C extends boolean>(
		value: any,
		options?: ToValueTypeOptions<IFileFieldDefinition, C>
	): IFileFieldValue {
		let stringValue =
			typeof value === 'string' || value.toString ? value.toString() : undefined

		const relativeTo = options?.relativeTo

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

		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const pathUtil = require('path')
		const dirname =
			pathUtil.sep === '/' ? pathUtil.dirname : pathUtil.win32.dirname

		// Check if path is the full file path
		if (path) {
			const parts = pathUtil.parse(path)
			// If it is then we should just get the directory name and set it to path
			if (parts.ext.length > 0) {
				path = dirname(path)
			}
		} else if (!path) {
			// Try to pull the path off the value
			path =
				stringValue.indexOf(pathUtil.sep) > -1
					? dirname(stringValue)
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

		if (relativeTo && path) {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const pathUtil = require('path')
			path = (pathUtil.relative(relativeTo, path) as string) || path
		}

		return {
			name,
			path,
			type,
			ext
		}
	}
}
