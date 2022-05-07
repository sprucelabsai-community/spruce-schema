import { FieldError } from '../errors/options.types'
import {
	FieldTemplateDetailOptions,
	FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { ToValueTypeOptions, ValidateOptions } from './field.static.types'
import { FileFieldDefinition, FileFieldValue } from './FileField.types'

export default class FileField extends AbstractField<FileFieldDefinition> {
	public static get description() {
		return 'A way to handle files. Supports mime-type lookups.'
	}

	public static generateTemplateDetails(
		options: FieldTemplateDetailOptions<FileFieldDefinition>
	): FieldTemplateDetails {
		return {
			valueType: `${options.importAs}.FileFieldValue${
				options.definition.isArray ? '[]' : ''
			}`,
		}
	}

	public validate(
		value: FileFieldValue,
		_?: ValidateOptions<FileFieldDefinition>
	): FieldError[] {
		const errors: FieldError[] = super.validate(value)
		const acceptableTypes = this.definition.options?.acceptableTypes ?? []

		if (
			value &&
			!value.base64 &&
			acceptableTypes[0] !== '*' &&
			acceptableTypes.indexOf(value.type!) === -1
		) {
			errors.push({
				code: 'INVALID_PARAMETER',
				name: this.name,
				friendlyMessage: `You sent a '${value.type}' to '${
					this.label ?? this.name
				}' and it only accepts '${acceptableTypes.join("', '")}'.`,
			})
		}

		return errors
	}

	public toValueType<C extends boolean>(
		value: any,
		_options?: ToValueTypeOptions<FileFieldDefinition, C>
	): FileFieldValue {
		return value
	}
}
