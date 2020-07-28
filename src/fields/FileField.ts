import mimeDb from 'mime-db'
import Mime from 'mime-type'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { IInvalidFieldError } from '../errors/error.types'
import SpruceError from '../errors/SpruceError'
import {
	IFieldTemplateDetailOptions,
	IFieldTemplateDetails,
} from '../template.types'
import AbstractField from './AbstractField'
import { ToValueTypeOptions, ValidateOptions } from './field.static.types'
import { IFileFieldDefinition, IFileFieldValue } from './FileField.types'

// @ts-ignore
const mime = new Mime(mimeDb, 2)
mime.define('application/typescript', {
	source: 'spruce',
	extensions: ['ts', 'tsx'],
})

export default class FileField extends AbstractField<IFileFieldDefinition> {
	public static get description() {
		return 'A way to handle files. Supports mime-type lookups.'
	}

	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<IFileFieldDefinition>
	): IFieldTemplateDetails {
		return {
			valueType: `${options.importAs}.IFileFieldValue${
				options.definition.isArray ? '[]' : ''
			}`,
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
			throw new SpruceError({
				code: 'TRANSFORMATION_ERROR',
				fieldType: FieldType.File,
				incomingTypeof: typeof value,
				incomingValue: value,
				name: this.name,
			})
		}

		ext = ext ?? pathUtil.extname(name)

		if (!type) {
			const lookupResults = mime.lookup(name)

			if (Array.isArray(lookupResults)) {
				type = lookupResults.pop()
			} else {
				type = lookupResults
			}
		}

		if (relativeTo && path) {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const pathUtil = require('path')
			path = (pathUtil.relative(relativeTo, path) as string) || path
		}

		return {
			name,
			path,
			type,
			ext,
		}
	}
}
