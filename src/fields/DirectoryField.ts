import { IFieldDefinition } from '../schema.types'
import { FieldType } from './fieldType'
import AbstractField from './AbstractField'
import {
	IFieldTemplateDetailOptions,
	IFieldTemplateDetails
} from '../template.types'
import SchemaError from '../errors/SchemaError'
import { ErrorCode } from '../errors/error.types'

export interface IDirectoryFieldValue {
	path: string
}

export type IDirectoryFieldDefinition = IFieldDefinition<
	IDirectoryFieldValue
> & {
	/** * .Directory - select whole directories all at once */
	type: FieldType.Directory
	options?: {}
}

export default class DirectoryField extends AbstractField<
	IDirectoryFieldDefinition
> {
	public static get description() {
		return 'A way to select entire directories once!'
	}

	public static templateDetails(
		options: IFieldTemplateDetailOptions<IDirectoryFieldDefinition>
	): IFieldTemplateDetails {
		const { definition } = options
		return {
			valueType: `${options.importAs}.IDirectoryFieldValue${
				definition.isArray ? '[]' : ''
			}`
		}
	}

	public toValueType(value: any): IDirectoryFieldValue {
		const stringValue =
			typeof value === 'string' || value.toString ? value.toString() : undefined

		let path: string | undefined

		if (stringValue) {
			path = stringValue
		} else if (typeof value === 'object') {
			path = value.path
		}

		if (!(typeof path === 'string') || path.length === 0) {
			throw new SchemaError({
				code: ErrorCode.TransformationFailed,
				fieldType: FieldType.Directory,
				incomingTypeof: typeof value,
				incomingValue: value,
				name: this.name
			})
		}

		return { path }
	}
}
