import AbstractSpruceError from '@sprucelabs/error'
import { assert } from '@sprucelabs/test'
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
function buildFailMessage(key: string, missing: string): string | undefined {
	return `Expected to be ${key} '${missing}', but I found it!`
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

const validationErrorAssertUtil = {
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
					assert.fail(buildFailMessage(key, lookup))
				}
			}
		}
	},
}

export default validationErrorAssertUtil
