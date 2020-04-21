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
				message = `${this.message}: :${options.schemaId}${
					options.friendlyMessage ? ` ${options.friendlyMessage}` : ''
				}`
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
				message = `${options.code}: The FileType.${options.fieldType} field could not transform a ${options.incomingTypeof} to the desired valueType. The incoming value was ${options.incomingValue}.`
				break
			case SchemaErrorCode.NotImplemented:
				message = `${options.code}: ${options.instructions}`
				break
			default:
				message = this.message
		}

		if (!message) {
			message = this.message
		}

		return message
	}
}
