import SpruceError from '../errors/SpruceError'
import {
	FieldTemplateDetailOptions,
	FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import {
	DirectoryFieldDefinition,
	DirectoryFieldValue,
} from './DirectoryField.types'
import { ToValueTypeOptions } from './field.static.types'

export default class DirectoryField extends AbstractField<
	DirectoryFieldDefinition
> {
	public static get description() {
		return 'A way to select entire directories once!'
	}

	public static generateTemplateDetails(
		options: FieldTemplateDetailOptions<DirectoryFieldDefinition>
	): FieldTemplateDetails {
		const { definition } = options
		return {
			valueType: `${options.importAs}.IDirectoryFieldValue${
				definition.isArray ? '[]' : ''
			}`,
		}
	}

	public toValueType<C extends boolean>(
		value: any,
		options?: ToValueTypeOptions<DirectoryFieldDefinition, C>
	): DirectoryFieldValue {
		const stringValue =
			typeof value === 'string' || value.toString ? value.toString() : undefined

		let path: string | undefined
		const relativeTo = options?.relativeTo

		if (stringValue) {
			path = stringValue
		} else if (typeof value === 'object') {
			path = value.path
		}

		if (!(typeof path === 'string') || path.length === 0) {
			throw new SpruceError({
				code: 'TRANSFORMATION_ERROR',
				fieldType: 'directory',
				incomingTypeof: typeof value,
				incomingValue: value,
				name: this.name,
			})
		}

		if (path && relativeTo) {
			// eslint-disable-next-line @typescript-eslint/no-var-requires
			const pathUtil = require('path')
			path = (pathUtil.relative(relativeTo, path) as string | undefined) || path
		}

		return { path }
	}
}
