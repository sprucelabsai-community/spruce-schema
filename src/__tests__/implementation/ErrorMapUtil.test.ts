import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { errorAssertUtil } from '@sprucelabs/test-utils'
import { InvalidFieldError } from '../../errors/error.options'
import mapFieldErrorsToParameterErrors from '../../utilities/mapFieldErrorsToParameterErrors'

export default class ErrorMapUtilTest extends AbstractSpruceTest {
	@test()
	protected static async canCreateErrorMapUtil() {
		assert.isFunction(mapFieldErrorsToParameterErrors)
	}

	@test()
	protected static async mapsMissingField() {
		const errs = this.Error([
			{
				code: 'missing_required',
				friendlyMessage: "'First name' is required!",
				name: 'firstName',
			},
		])

		const errors = mapFieldErrorsToParameterErrors(errs)

		assert.isLength(errors, 1)
		errorAssertUtil.assertError(errors[0], 'MISSING_PARAMETERS', {
			parameters: ['firstName'],
		})
	}

	@test()
	protected static async maps2MissingFields() {
		const errs = this.Error([
			{
				code: 'missing_required',
				friendlyMessage: "'First name' is required!",
				name: 'firstName',
			},
			{
				code: 'missing_required',
				name: 'lastName',
			},
		])

		const errors = mapFieldErrorsToParameterErrors(errs)

		assert.isLength(errors, 1)
		errorAssertUtil.assertError(errors[0], 'MISSING_PARAMETERS', {
			parameters: ['firstName', 'lastName'],
		})
	}

	@test()
	protected static async mapsInvalidParameters() {
		const errs = this.Error([
			{
				code: 'invalid_value',
				name: 'phone',
			},
		])

		const errors = mapFieldErrorsToParameterErrors(errs)

		assert.isLength(errors, 1)
		errorAssertUtil.assertError(errors[0], 'INVALID_PARAMETERS', {
			parameters: ['phone'],
		})
	}

	@test()
	protected static async mapsUnexpectedParameters() {
		const errs = this.Error([
			{
				code: 'unexpected_value',
				name: 'phone',
			},
		])

		const errors = mapFieldErrorsToParameterErrors(errs)

		assert.isLength(errors, 1)
		errorAssertUtil.assertError(errors[0], 'UNEXPECTED_PARAMETERS', {
			parameters: ['phone'],
		})
	}

	@test()
	protected static async mapsAll() {
		const errs = this.Error([
			{
				code: 'unexpected_value',
				name: 'phone',
			},
			{
				code: 'invalid_value',
				name: 'email',
			},
			{
				code: 'missing_required',
				friendlyMessage: "'First name' is required!",
				name: 'firstName',
			},
		])

		const errors = mapFieldErrorsToParameterErrors(errs)

		assert.isLength(errors, 3)
		errorAssertUtil.assertError(errors[0], 'MISSING_PARAMETERS', {
			parameters: ['firstName'],
		})
		errorAssertUtil.assertError(errors[1], 'INVALID_PARAMETERS', {
			parameters: ['email'],
		})

		errorAssertUtil.assertError(errors[2], 'UNEXPECTED_PARAMETERS', {
			parameters: ['phone'],
		})
	}

	private static Error(errors: any[]) {
		return errors as InvalidFieldError[]
	}
}
