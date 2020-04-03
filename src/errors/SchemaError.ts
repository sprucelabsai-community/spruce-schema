import AbstractSpruceError from '@sprucelabs/error'
import { SchemaErrorOptions, SchemaErrorCode } from './types'

export default class SchemaError extends AbstractSpruceError<
	SchemaErrorOptions
> {
	/** A readable message */
	public friendlyMessage(): string {
		const { options } = this

		let message: string | undefined

		switch (options?.code) {
			case SchemaErrorCode.DuplicateSchemaId:
			case SchemaErrorCode.SchemaNotFound:
				message = `${this.message}: :${options.schemaId}${
					options.additionalDetails ? ` ${options.additionalDetails}` : ''
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
			default:
				message = this.message
		}

		if (!message) {
			message = this.message
		}

		return message
	}
}
