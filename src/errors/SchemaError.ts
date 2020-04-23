import BaseSpruceError from '@sprucelabs/error'
import { SchemaErrorOptions, SchemaErrorCode } from './error.types'

export default class SchemaError extends BaseSpruceError<SchemaErrorOptions> {
	/** A readable message */
	public friendlyMessage(): string {
		const { options } = this

		let message: string | undefined

		switch (options?.code) {
			case SchemaErrorCode.DuplicateSchema:
			case SchemaErrorCode.SchemaNotFound:
				message = `Duplicate schema id "${options.schemaId}"`
				break
			case SchemaErrorCode.InvalidField:
				message = `Invalid fields on ${options.schemaId}: `
				options.errors.forEach(fieldErrors => {
					message += `(${fieldErrors.fieldName}: [`
					message += fieldErrors.errors.join(', ')
					message += `])`
				})
				break
			case SchemaErrorCode.TransformationFailed:
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
			case SchemaErrorCode.NotImplemented:
				message = `${options.code}: ${options.instructions}`
				break
			case SchemaErrorCode.InvalidSchemaDefinition:
				message = `Invalid definition. ${
					options.errors.length > 0
						? `Errors are: \n\n${options.errors.join('\n')}\n\n`
						: ``
				}`

				break
			case SchemaErrorCode.InvalidFieldOptions:
				message = `Invalid field options for schemaId: "${options.schemaId}", fieldName: "${options.fieldName}"`
				message += !options.options
					? ' - **missing options**'
					: `\n\n${JSON.stringify(options.options, null, 2).substr(0, 2000)}`
				break
			default:
				message = this.message
		}

		if (!message) {
			message = this.message
		}

		if (options.friendlyMessage) {
			message += `\n\n${options.friendlyMessage}`
		}

		return message
	}
}
