import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import { ErrorCode } from '../errors/error.types'
import SpruceError from '../errors/SpruceError'
import { IFieldDefinition, ToValueTypeOptions } from '../schema.types'
import {
	IFieldTemplateDetailOptions,
	IFieldTemplateDetails
} from '../template.types'
import AbstractField from './AbstractField'

export interface IDirectoryFieldValue {
	path: string
}

export type IDirectoryFieldDefinition = IFieldDefinition<
	IDirectoryFieldValue
> & {
	/** * .Directory - select whole directories all at once */
	type: FieldType.Directory
	options?: {
		/** Will give you a path relative to this one, if possible */
		relativeTo?: string
	}
}

export default class DirectoryField extends AbstractField<
	IDirectoryFieldDefinition
> {
	public static get description() {
		return 'A way to select entire directories once!'
	}

	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<IDirectoryFieldDefinition>
	): IFieldTemplateDetails {
		const { definition } = options
		return {
			valueType: `${options.importAs}.IDirectoryFieldValue${
				definition.isArray ? '[]' : ''
			}`
		}
	}

	public toValueType<C extends boolean>(
		value: any,
		options?: ToValueTypeOptions<IDirectoryFieldDefinition, C>
	): IDirectoryFieldValue {
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
				code: ErrorCode.TransformationFailed,
				fieldType: FieldType.Directory,
				incomingTypeof: typeof value,
				incomingValue: value,
				name: this.name
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
