import AbstractSpruceError from '@sprucelabs/error'
import {
	FieldErrorCode,
	InvalidFieldError,
	ValidationFailedErrorOptions,
} from './options.types'
import SpruceError from './SpruceError'

export interface RenderOptions {
	shouldUseReadableNames?: boolean
	shouldRenderHeadline?: boolean
}
export class ValidateErrorMessageFormatter {
	private error: AbstractSpruceError<ValidationFailedErrorOptions>
	private namePrefix?: string

	public constructor(
		error: AbstractSpruceError<ValidationFailedErrorOptions>,
		options?: { namePrefix?: string }
	) {
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

		this.namePrefix = options?.namePrefix
		this.error = error
	}

	private renderError(options: {
		fieldError: InvalidFieldError
		count: number
	}) {
		const { fieldError, count } = options
		const lines: string[] = []

		const name = this.renderFieldName(fieldError)

		if (fieldError?.error) {
			const formatter = new ValidateErrorMessageFormatter(
				fieldError.error as any,
				{ namePrefix: name }
			)
			lines.push(formatter.render({ shouldRenderHeadline: false }))
		} else {
			const msg = fieldError.friendlyMessage
				? `${count}. ${fieldError.friendlyMessage}`
				: `${count}. '${name}' is ${this.fieldErrorCodeToFriendly(
						fieldError.code
				  )}.`

			lines.push(msg)
		}

		return lines.join('\n')
	}

	private renderFieldName(fieldError: InvalidFieldError) {
		return this.namePrefix
			? `${this.namePrefix}.${fieldError.name}`
			: fieldError.name
	}

	private fieldErrorCodeToFriendly(code: FieldErrorCode) {
		const map: Record<FieldErrorCode, string> = {
			invalid_value: 'invalid',
			missing_required: 'required',
			unexpected_value: 'does not exist',
		}

		return map[code]
	}

	private getTotalErrors() {
		let count = 0

		for (const error of this.error.options.errors) {
			const fieldErrors = error.options.errors ?? []
			for (const fieldError of fieldErrors) {
				const subError = fieldError.error
				if (subError) {
					const formatter = new ValidateErrorMessageFormatter(subError as any)
					count += formatter.getTotalErrors()
				} else {
					count += 1
				}
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
			for (const fieldError of error.options.errors ?? []) {
				lines.push(this.renderError({ fieldError, count }))
				count++
			}
		}

		message += lines.join('\n')

		return message
	}
}
