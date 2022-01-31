import AbstractSpruceError from '@sprucelabs/error'
import { assert, assertUtil } from '@sprucelabs/test'
import {
	FieldErrorCode,
	SchemaErrorOptions,
	FieldError,
} from '../errors/options.types'
import SpruceError from '../errors/SpruceError'

type ValidationErrorAssertOptions = {
	missing?: string[]
	invalid?: string[]
	unexpected?: string[]
}

export type ValidationErrorAssertOptionsKey = keyof ValidationErrorAssertOptions
function buildFailMessage(
	code: FieldErrorCode,
	name: string,
	options: Record<string, any>
): string | undefined {
	const templates: Record<FieldErrorCode, string> = {
		INVALID_PARAMETER: `Expected '${name}' to be invalid. But it appears it is.`,
		MISSING_PARAMETER: `I found '${name}' even though it should be reported as missing.`,
		UNEXPECTED_PARAMETER: `I was expecting to unexpectedly find '${name}', but I didn't.`,
	}
	return `${templates[code]}\n\nHere is the error I got: ${assertUtil.stringify(
		options
	)}`
}

function flattenFields(
	fieldErrors: FieldError[],
	flattened: Record<string, any>,
	namePrefix = ''
) {
	fieldErrors.forEach((err) => {
		const name = namePrefix + err.name
		flattened[name] = err.code
		if (err.errors) {
			flattenFields(err.errors, flattened, name + '.')
		}
	})
}

const validationErrorAssert = {
	assertError(error: any, options: ValidationErrorAssertOptions) {
		const missing: string[] = []

		const err = error as AbstractSpruceError<SchemaErrorOptions>

		if (!err) {
			missing.push('error')
		}

		if (!options) {
			missing.push('options')
		}

		if (missing.length > 0) {
			throw new SpruceError({
				code: 'MISSING_PARAMETERS',
				parameters: missing,
			})
		}

		if (err.options?.code !== 'VALIDATION_FAILED') {
			throw new SpruceError({
				code: 'INVALID_PARAMETERS',
				parameters: ['error'],
				friendlyMessage: `Expected error to be SchemaError({code: 'VALIDATION_FAILED'})`,
			})
		}

		const keys: ValidationErrorAssertOptionsKey[] = [
			'missing',
			'invalid',
			'unexpected',
		]

		const codes: FieldErrorCode[] = [
			'MISSING_PARAMETER',
			'INVALID_PARAMETER',
			'UNEXPECTED_PARAMETER',
		]

		const fieldErrors = err.options.errors

		const flattened: Record<string, any> = {}
		flattenFields(fieldErrors, flattened)

		for (let idx = 0; idx < keys.length; idx++) {
			const code = codes[idx]
			const key = keys[idx]

			for (const lookup of options?.[key] ?? []) {
				const match = flattened[lookup] === code
				if (!match) {
					assert.fail(buildFailMessage(code, lookup, flattened))
				}
			}
		}
	},
}

export default validationErrorAssert
