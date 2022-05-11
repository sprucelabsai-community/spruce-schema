import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { errorAssert } from '@sprucelabs/test-utils'
import { FieldError } from '../../errors/options.types'
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
				code: 'MISSING_PARAMETER',
				friendlyMessage: "'First name' is required!",
				name: 'firstName',
			},
		])

		const errors = mapFieldErrorsToParameterErrors(errs)

		assert.isLength(errors, 1)
		errorAssert.assertError(errors[0], 'MISSING_PARAMETERS', {
			parameters: ['firstName'],
		})
	}

	@test()
	protected static async maps2MissingFields() {
		const errs = this.Error([
			{
				code: 'MISSING_PARAMETER',
				friendlyMessage: "'First name' is required!",
				name: 'firstName',
			},
			{
				code: 'MISSING_PARAMETER',
				name: 'lastName',
			},
		])

		const errors = mapFieldErrorsToParameterErrors(errs)

		assert.isLength(errors, 1)
		errorAssert.assertError(errors[0], 'MISSING_PARAMETERS', {
			parameters: ['firstName', 'lastName'],
		})
	}

	@test()
	protected static async mapsInvalidParameters() {
		const errs = this.Error([
			{
				code: 'INVALID_PARAMETER',
				name: 'phone',
			},
		])

		const errors = mapFieldErrorsToParameterErrors(errs)

		assert.isLength(errors, 1)
		errorAssert.assertError(errors[0], 'INVALID_PARAMETERS', {
			parameters: ['phone'],
		})
	}

	@test()
	protected static async mapsUnexpectedParameters() {
		const errs = this.Error([
			{
				code: 'UNEXPECTED_PARAMETER',
				name: 'phone',
			},
		])

		const errors = mapFieldErrorsToParameterErrors(errs)

		assert.isLength(errors, 1)
		errorAssert.assertError(errors[0], 'UNEXPECTED_PARAMETERS', {
			parameters: ['phone'],
		})
	}

	@test()
	protected static async mapsAll() {
		const errs = this.Error([
			{
				code: 'UNEXPECTED_PARAMETER',
				name: 'phone',
			},
			{
				code: 'INVALID_PARAMETER',
				name: 'email',
			},
			{
				code: 'MISSING_PARAMETER',
				friendlyMessage: "'First name' is required!",
				name: 'firstName',
			},
		])

		const errors = mapFieldErrorsToParameterErrors(errs)

		assert.isLength(errors, 3)
		errorAssert.assertError(errors[0], 'MISSING_PARAMETERS', {
			parameters: ['firstName'],
		})
		errorAssert.assertError(errors[1], 'INVALID_PARAMETERS', {
			parameters: ['email'],
		})

		errorAssert.assertError(errors[2], 'UNEXPECTED_PARAMETERS', {
			parameters: ['phone'],
		})
	}

	@test()
	protected static mapsSubErrors() {
		const errs = this.Error([
			{
				code: 'UNEXPECTED_PARAMETER',
				name: 'phone',
			},
			{
				code: 'INVALID_PARAMETER',
				name: 'address',
				errors: [
					{
						code: 'MISSING_PARAMETER',
						name: 'street1',
					},
				],
			},
			{
				code: 'MISSING_PARAMETER',
				friendlyMessage: "'First name' is required!",
				name: 'firstName',
			},
		])

		const errors = mapFieldErrorsToParameterErrors(errs)

		assert.isLength(errors, 2)
		errorAssert.assertError(errors[0], 'MISSING_PARAMETERS', {
			parameters: ['address.street1', 'firstName'],
		})

		errorAssert.assertError(errors[1], 'UNEXPECTED_PARAMETERS', {
			parameters: ['phone'],
		})
	}

	private static Error(errors: FieldError[]) {
		return errors as FieldError[]
	}
}
