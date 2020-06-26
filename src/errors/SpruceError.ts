import AbstractSpruceError from '@sprucelabs/error'
import { SchemaErrorOptions, ErrorCode } from './error.types'

export default class SpruceError extends AbstractSpruceError<
	SchemaErrorOptions
> {
	/** A readable message */
	public friendlyMessage(): string {
		const { options } = this

		let message: string | undefined

		switch (options?.code) {
			case ErrorCode.DuplicateSchema:
				message = `Duplicate schema${options.version ? ' and version' : ''}: ${
					options.schemaId
				}${options.version ? ` ${options.version}` : ''}`
				break
			case ErrorCode.SchemaNotFound:
				message = `Could not find schema "${options.schemaId}${
					options.version ? `(${options.version})` : ''
				}"`
				break
			case ErrorCode.InvalidField:
				message = `Invalid fields on ${options.schemaId}: `
				options.errors.forEach(fieldError => {
					message += `${fieldError.friendlyMessage ??
						`${fieldError.name}: ${fieldError.code}`}\n`
				})
				break
			case ErrorCode.TransformationFailed:
				message = `${options.code}: The FileType.${
					options.fieldType
				} field could not transform a ${
					options.incomingTypeof
				} to the desired valueType. The incoming value was ${(JSON.stringify(
					options.incomingValue
				),
				null,
				2)}.`
				break
			case ErrorCode.NotImplemented:
				message = `${options.code}: ${options.instructions}`
				break
			case ErrorCode.InvalidSchemaDefinition:
				message = `Invalid definition with id: ${options.schemaId}. ${
					options.errors.length > 0
						? `Errors are: \n\n${options.errors.join('\n')}\n\n`
						: ``
				}`

				break
			case ErrorCode.InvalidFieldOptions:
				message = `Invalid field options for schemaId: "${options.schemaId}", fieldName: "${options.fieldName}"`
				message += !options.options
					? ' - **missing options**'
					: `\n\n${JSON.stringify(options.options, null, 2).substr(0, 2000)}`
				break
			default:
				message = this.message
		}

		// Drop on code and friendly message
		message = `${options.code}: ${message}`
		const fullMessage = `${message}${
			options.friendlyMessage ? `\n\n${options.friendlyMessage}` : ''
		}`

		// Handle repeating text from original message by remove it
		return `${fullMessage}${
			this.originalError && this.originalError.message !== fullMessage
				? `\n\nOriginal error: ${this.originalError.message.replace(
						message,
						''
				  )}`
				: ''
		}`
	}
}
