import { FieldError } from '../errors/options.types'
import {
    FieldTemplateDetailOptions,
    FieldTemplateDetails,
} from '../types/template.types'
import AbstractField from './AbstractField'
import { ToValueTypeOptions, ValidateOptions } from './field.static.types'
import {
    FileFieldDefinition,
    FileFieldValue,
    SupportedFileType,
} from './FileField.types'

export default class FileField extends AbstractField<FileFieldDefinition> {
    public static readonly description =
        'A way to handle files. Supports mime-type lookups.'

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
            value.type &&
            !this.isValidType(value.type)
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

    private isValidType(type: SupportedFileType): boolean {
        const types = this.definition.options?.acceptableTypes ?? []
        const typeParts = type.split('/')
        const typeStarred = `${typeParts[0]}/*` as SupportedFileType
        return (
            types[0] === '*' ||
            types.indexOf(type) !== -1 ||
            types.indexOf(typeStarred) !== -1
        )
    }

    public toValueType<C extends boolean>(
        value: any,
        _options?: ToValueTypeOptions<FileFieldDefinition, C>
    ): FileFieldValue {
        return value
    }
}
