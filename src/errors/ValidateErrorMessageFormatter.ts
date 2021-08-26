import AbstractSpruceError from '@sprucelabs/error'
import {
	FieldErrorCode,
	FieldError,
	ValidationFailedErrorOptions,
} from './options.types'
import SpruceError from './SpruceError'

export interface RenderOptions {
	shouldUseReadableNames?: boolean
	shouldRenderHeadline?: boolean
}
export class ValidateErrorMessageFormatter {
	private error: AbstractSpruceError<ValidationFailedErrorOptions>

	public constructor(error: AbstractSpruceError<ValidationFailedErrorOptions>) {
		if (!error) {
			throw new SpruceError({
				code: 'MISSING_PARAMETERS',
				parameters: ['error'],
			})
		} else if (error.options?.code !== 'VALIDATION_FAILED') {
			throw new SpruceError({
				code: 'INVALID_PARAMETERS',
				parameters: ['error'],
				friendlyMessage:
					'Must pass a SpruceError with code of `VALIDATION_FAILED`.',
			})
		}

		this.error = error
	}

	private renderError(options: {
		fieldError: FieldError
		count: number
		namePrefix?: string
	}) {
		const { fieldError, count: countOption, namePrefix } = options
		let count = countOption

		const lines: string[] = []

		const name = this.renderFieldName(fieldError, namePrefix)

		if (fieldError?.errors) {
			for (const error of fieldError.errors) {
				lines.push(
					this.renderError({ fieldError: error, count, namePrefix: name })
				)
				count++
			}
		} else {
			const msg = fieldError.friendlyMessage
				? `${count}. (${name}) ${fieldError.friendlyMessage}`
				: `${count}. '${name}' is ${this.fieldErrorCodeToFriendly(
						fieldError.code
				  )}.`

			lines.push(msg)
		}

		return lines.join('\n')
	}

	private renderFieldName(fieldError: FieldError, namePrefix?: string) {
		return namePrefix ? `${namePrefix}.${fieldError.name}` : fieldError.name
	}

	private fieldErrorCodeToFriendly(code: FieldErrorCode) {
		const map: Record<FieldErrorCode, string> = {
			INVALID_PARAMETER: 'invalid',
			MISSING_PARAMETER: 'required',
			UNEXPECTED_PARAMETER: 'does not exist',
		}

		return map[code]
	}

	private getTotalErrors() {
		const errors = this.error.options.errors
		const count = this.countErrors(errors)

		return count
	}

	private countErrors(errors: FieldError[]) {
		let count = 0
		for (const error of errors) {
			if (error.errors) {
				count += this.countErrors(error.errors)
			} else {
				count += 1
			}
		}
		return count
	}

	private renderSchemaName(shouldUseReadableNames = false) {
		return shouldUseReadableNames
			? this.error.options.schemaName ?? this.error.options.schemaId
			: this.error.options.schemaId
	}

	public render(options?: RenderOptions) {
		const totalErrors = this.getTotalErrors()

		let message =
			options?.shouldRenderHeadline === false
				? ''
				: `'${this.renderSchemaName(
						options?.shouldUseReadableNames
				  )}' has ${totalErrors} error${totalErrors === 1 ? '' : 's'}!\n\n`

		const errors = this.error.options.errors
		let count = 1
		const lines: string[] = []
		for (const error of errors) {
			lines.push(this.renderError({ fieldError: error, count }))
			count++
		}

		message += lines.join('\n')

		return message
	}
}
