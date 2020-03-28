import SpruceError from '@sprucelabs/error'
import { SchemaErrorOptions, SchemaErrorCode } from './types'

export default class SchemaError extends SpruceError<SchemaErrorOptions> {

	/** a readable message */
	public friendlyMessage(): string {
		const { options } = this

		let message

		switch (options?.code) {
			case SchemaErrorCode.Duplicate:
			case SchemaErrorCode.NotFound:
				message = `${this.message}: :${options.schemaId}${
					options.additionalDetails ? ` ${options.additionalDetails}` : ''
				}`
				break
			case SchemaErrorCode.InvalidField:
				breakpoint
				console.log('what ?')
				break
			default:
				message = this.message
		}

		return message
	}
}
