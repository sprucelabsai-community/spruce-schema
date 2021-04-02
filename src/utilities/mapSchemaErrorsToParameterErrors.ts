import AbstractSpruceError from '@sprucelabs/error'
import SpruceError from '../errors/SpruceError'

export default function mapSchemaErrorsToParameterErrors(
	err: SpruceError | Error | Record<string, any>,
	fallbackErrorWhenUnableToMapToSpruceError?: SpruceError
): SpruceError[] {
	if (err instanceof AbstractSpruceError) {
		if (err.options.code === 'INVALID_FIELD') {
			const {
				missingParameters,
				invalidParameters,
				unexpectedParamaters,
			} = pullParamaterIssues(err)

			let foundParameterIssues =
				missingParameters.length > 0 ||
				invalidParameters.length > 0 ||
				unexpectedParamaters.length > 0

			if (!foundParameterIssues) {
				return [err]
			}

			const errors: SpruceError[] = []

			if (missingParameters.length > 0) {
				errors.push(
					new SpruceError({
						code: 'MISSING_PARAMETERS',
						parameters: missingParameters,
					})
				)
			}

			if (invalidParameters.length > 0) {
				errors.push(
					new SpruceError({
						code: 'INVALID_PARAMETERS',
						parameters: invalidParameters,
					})
				)
			}

			if (unexpectedParamaters.length > 0) {
				errors.push(
					new SpruceError({
						code: 'UNEXPECTED_PARAMETERS',
						parameters: unexpectedParamaters,
					})
				)
			}

			return errors
		} else {
			return [err]
		}
	} else if (!(err instanceof Error)) {
		const e = AbstractSpruceError.parse(err, SpruceError)
		return [e]
	}

	const fallback =
		err instanceof AbstractSpruceError
			? [err]
			: [
					fallbackErrorWhenUnableToMapToSpruceError ??
						new SpruceError({
							code: 'UNKNOWN_ERROR',
							originalError: err,
						}),
			  ]

	return fallback as SpruceError[]
}

function pullParamaterIssues(
	err: any,
	prefix = ''
): {
	missingParameters: string[]
	invalidParameters: string[]
	unexpectedParamaters: string[]
} {
	const missingParameters: string[] = []
	const invalidParameters: string[] = []
	const unexpectedParamaters: string[] = []

	err.options?.errors?.forEach((fieldError: any) => {
		const fieldName = prefix ? `${prefix}.${fieldError.name}` : fieldError.name
		if (fieldError.code === 'missing_required') {
			missingParameters.push(fieldName)
		} else if (fieldError.code === 'invalid_value') {
			invalidParameters.push(fieldName)
		} else if (fieldError.code === 'unexpected') {
			unexpectedParamaters.push(fieldName)
		} else if (fieldError.code === 'invalid_related_schema_values') {
			const {
				missingParameters: missing,
				invalidParameters: invalid,
				unexpectedParamaters: unexpected,
			} = pullParamaterIssues(fieldError.error, fieldName)
			missingParameters.push(...missing)
			invalidParameters.push(...invalid)
			unexpectedParamaters.push(...unexpected)
		}
	})
	return { missingParameters, invalidParameters, unexpectedParamaters }
}
