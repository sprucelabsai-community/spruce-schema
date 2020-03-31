import SpruceError from '@sprucelabs/error'
import { SchemaErrorOptions, SchemaErrorCode } from './types'

export default class SchemaError extends SpruceError<SchemaErrorOptions> {
	/** A readable message */
	public friendlyMessage(): string {
		const { options } = this

		let message: string | undefined

		switch (options?.code) {
			case SchemaErrorCode.Duplicate:
			case SchemaErrorCode.NotFound:
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

		return message
	}
}
