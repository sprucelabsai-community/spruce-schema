import AbstractSpruceError from '@sprucelabs/error'
import { SchemaErrorOptions } from './error.types'

export default class SpruceError extends AbstractSpruceError<
	SchemaErrorOptions
> {
	/** A readable message */
	public friendlyMessage(): string {
		const { options } = this

		let message: string | undefined

		switch (options?.code) {
			case 'DUPLICATE_SCHEMA':
				message = `Duplicate schema${options.version ? ' and version' : ''}: ${
					options.schemaId
				}${options.version ? ` ${options.version}` : ''}`
				break
			case 'SCHEMA_NOT_FOUND':
				message = `Could not find schema "${options.schemaId}${
					options.version ? `(${options.version})` : ''
				}"`
				break
			case 'INVALID_FIELD':
				message = `Invalid fields on '${options.schemaId}': `
				options.errors.forEach((fieldError) => {
					message += `${
						fieldError.friendlyMessage ??
						`${fieldError.name}: ${fieldError.code}`
					}\n`
				})
				break
			case 'TRANSFORMATION_ERROR':
				message = ''
				options.errors?.forEach((error) => {
					message += `Error on ${error.name}: `
					if (error.error) {
						message += `${error.error?.message}`
					}
				})

				if (message === '') {
					message = `Could not transform a(n) ${
						options.incomingTypeof
					} to the  ${options.fieldType}. The incoming value was ${
						(JSON.stringify(options.incomingValue), null, 2)
					}.`
				}

				break
			case 'NOT_IMPLEMENTED':
				message = `${options.code}: ${options.instructions}`
				break
			case 'INVALID_SCHEMA_DEFINITION':
				message = `Invalid definition with id: ${options.schemaId}. ${
					options.errors.length > 0
						? `Errors are: \n\n${options.errors.join('\n')}\n\n`
						: ``
				}`

				break
			case 'INVALID_FIELD_OPTIONS':
				message = `Invalid field options for schemaId: "${options.schemaId}", fieldName: "${options.fieldName}"`
				message += !options.options
					? ' - **missing options**'
					: `\n\n${JSON.stringify(options.options, null, 2).substr(0, 2000)}`
				break

			case 'FIELD_NOT_FOUND':
				message = `I couldn't find ${options.fields
					.map((name) => `'${name}'`)
					.join(', ')} field${options.fields.length === 1 ? '' : 's'} on ${
					options.schemaId
				}.`
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
