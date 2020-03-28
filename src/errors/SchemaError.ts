import { SpruceError } from '@sprucelabs/error'
import { SchemaErrorOptions, SchemaErrorCode } from './types'

export default class SchemaError extends SpruceError<SchemaErrorOptions> {
	public friendlyMessage(): string {
		const { options } = this

		let message

		switch (options?.code) {
			case SchemaErrorCode.Duplicate:
			case SchemaErrorCode.NotFound:
				message = `${this.message}: :${options.schemaId}${
					options.notes ? ` ${options.notes}` : ''
				}`
				break
			default:
				message = this.message
		}

		return message
	}
}
