import AbstractSpruceError from '@sprucelabs/error'
import { SchemaErrorOptions } from './error.options'
import { ValidateErrorMessageFormatter } from './ValidateErrorMessageFormatter'

export default class SpruceError extends AbstractSpruceError<SchemaErrorOptions> {
	public friendlyMessage(): string {
		const { options } = this

		if (options.friendlyMessage) {
			return options.friendlyMessage
		}

		let message: string | undefined

		switch (options?.code) {
			case 'DUPLICATE_SCHEMA':
				message = `Duplicate schema -> '${this.buildSchemaName(options)}'.`
				break
			case 'SCHEMA_NOT_FOUND':
				message = `Could not find schema -> '${this.buildSchemaName(options)}'.`
				break
			case 'TRANSFORMATION_ERROR':
				message = ''
				options.errors?.forEach((error) => {
					message += `Error on ${error.name}:\n`
					if (error.error) {
						message += `  ${error.error?.message}`
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
			case 'INVALID_SCHEMA':
				message = `Invalid schema with id: ${options.schemaId}. ${
					options.errors.length > 0
						? `Errors are: \n\n${options.errors.join('\n')}\n\n`
						: ``
				}`

				break

			case 'VALIDATION_FAILED': {
				const formatter = new ValidateErrorMessageFormatter(this as any)
				message = formatter.render()

				break
			}

			case 'MISSING_PARAMETERS':
			case 'UNEXPECTED_PARAMETERS':
			case 'INVALID_PARAMETERS':
				message = this.renderParametersWithFriendlyMessages(
					options.parameters,
					options.friendlyMessages
				)
				break

			default:
				message = this.message
		}

		return message
	}

	private renderParametersWithFriendlyMessages(
		parameters: string[],
		friendlyMessages?: string[]
	) {
		const friendly = (friendlyMessages ?? parameters)
			.filter((m) => !!m)
			.map((m) => `${m}`)
			.join('\n')

		if (!friendly) {
			return ''
		}

		return friendly
	}

	private buildSchemaName(options: {
		schemaId: string
		version?: string
		namespace?: string
	}) {
		return `${options.namespace ? options.namespace + '.' : ''}${
			options.schemaId
		}${options.version ? `(version: ${options.version})` : ''}`
	}
}
