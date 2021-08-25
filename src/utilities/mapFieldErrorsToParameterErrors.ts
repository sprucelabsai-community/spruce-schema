import { InvalidFieldError, ValidationError } from '../errors/options.types'
import SpruceError from '../errors/SpruceError'

export default function mapFieldErrorsToParameterErrors(
	fieldErrors: InvalidFieldError[]
): ValidationError[] {
	const { missingParameters, invalidParameters, unexpectedParamaters } =
		pullParamaterIssues(fieldErrors)

	const errors: ValidationError[] = []

	if (missingParameters.length > 0) {
		errors.push(
			new SpruceError({
				code: 'MISSING_PARAMETERS',
				parameters: missingParameters.map((p) => p.name),
				fieldErrors: missingParameters,
			}) as ValidationError
		)
	}

	if (invalidParameters.length > 0) {
		errors.push(
			new SpruceError({
				code: 'INVALID_PARAMETERS',
				parameters: invalidParameters.map((p) => p.name),
				fieldErrors: invalidParameters,
			}) as ValidationError
		)
	}

	if (unexpectedParamaters.length > 0) {
		errors.push(
			new SpruceError({
				code: 'UNEXPECTED_PARAMETERS',
				parameters: unexpectedParamaters.map((p) => p.name),
				fieldErrors: unexpectedParamaters,
			}) as ValidationError
		)
	}

	return errors
}

function pullParamaterIssues(
	errors: InvalidFieldError[],
	prefix = ''
): {
	missingParameters: InvalidFieldError[]
	invalidParameters: InvalidFieldError[]
	unexpectedParamaters: InvalidFieldError[]
} {
	const missingParameters: InvalidFieldError[] = []
	const invalidParameters: InvalidFieldError[] = []
	const unexpectedParamaters: InvalidFieldError[] = []

	errors.forEach((fieldError: any) => {
		const fieldName = prefix ? `${prefix}.${fieldError.name}` : fieldError.name

		if (fieldError.code === 'missing_required') {
			missingParameters.push({
				parameter: fieldName,
				...fieldError,
			})
		} else if (fieldError.code === 'invalid_value') {
			invalidParameters.push({
				parameter: fieldName,
				...fieldError,
			})
		} else if (fieldError.code === 'unexpected_value') {
			unexpectedParamaters.push({
				parameter: fieldName,
				...fieldError,
			})
		}
	})
	return { missingParameters, invalidParameters, unexpectedParamaters }
}
