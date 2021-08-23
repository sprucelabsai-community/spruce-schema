import AbstractSpruceError from '@sprucelabs/error'
import {
	InvalidFieldErrorOptions,
	SchemaErrorOptions,
	ValidationFailedErrorOptions,
} from './error.options'

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
			case 'INVALID_FIELD':
				message = this.generateNestedErrorMessage(options)
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

			case 'VALIDATION_FAILED':
				message = this.buildValidationFailedErrorMessage(options)

				break

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

	private buildValidationFailedErrorMessage(
		options: ValidationFailedErrorOptions
	): string {
		const totalErrors = this.countErrors(options)

		let message = `Validating \`${
			options.schemaName ?? options.schemaId
		}\` failed with ${totalErrors} error${totalErrors === 1 ? '' : 's'}.\n\n`

		let c = 0
		for (const err of options.errors) {
			message += `${++c}. ${err.message}\n`
		}

		return message
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

	private generateNestedErrorMessage(
		options: InvalidFieldErrorOptions,
		messageOptions?: { indentDepth: number }
	) {
		let { indentDepth = 0 } = messageOptions || {}
		let indention = this.buildIndention(indentDepth)

		let message =
			indentDepth === 0
				? `${indention}${this.countErrors(options)} error${
						this.countErrors(options) === 1 ? '' : 's'
				  } for '${options.schemaId}'.\n`
				: ``

		indentDepth++
		indention = this.buildIndention(indentDepth)

		options.errors.forEach((fieldError) => {
			message += `${indention}- ${
				fieldError.friendlyMessage ?? `'${fieldError.name}': ${fieldError.code}`
			}\n`

			if (fieldError.error) {
				if (
					fieldError.error instanceof SpruceError &&
					fieldError.error.options.code === 'INVALID_FIELD'
				) {
					message +=
						fieldError.error.generateNestedErrorMessage(
							fieldError.error.options,
							{ indentDepth: indentDepth + 1 }
						) + '\n'
				} else {
					message += `${this.buildIndention(indentDepth + 1)}${
						fieldError.error.message
					}\n`
				}
			}
		})

		return message.trim()
	}

	private countErrors(
		options: InvalidFieldErrorOptions | ValidationFailedErrorOptions
	) {
		return 3
	}

	private buildIndention(indentDepth: number) {
		let indention = ''
		for (let c = 0; c < indentDepth; c++) {
			indention += `   `
		}
		return indention
	}
}
