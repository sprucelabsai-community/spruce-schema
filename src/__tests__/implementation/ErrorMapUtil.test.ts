import { errorAssertUtil } from '@sprucelabs/test-utils'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import SpruceError from '../../errors/SpruceError'
import mapSchemaErrorsToParameterErrors from '../../utilities/mapSchemaErrorsToParameterErrors'

export default class ErrorMapUtilTest extends AbstractSpruceTest {
	@test()
	protected static async canCreateErrorMapUtil() {
		assert.isFunction(mapSchemaErrorsToParameterErrors)
	}

	@test()
	protected static async mapsMissingField() {
		const err = this.Error([
			{
				code: 'missing_required',
				friendlyMessage: "'First name' is required!",
				name: 'firstName',
			},
		])

		const errors = mapSchemaErrorsToParameterErrors(err)

		assert.isLength(errors, 1)
		errorAssertUtil.assertError(errors[0], 'MISSING_PARAMETERS', {
			parameters: ['firstName'],
		})
	}

	@test()
	protected static async maps2MissingFields() {
		const err = this.Error([
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

		const errors = mapSchemaErrorsToParameterErrors(err)

		assert.isLength(errors, 1)
		errorAssertUtil.assertError(errors[0], 'MISSING_PARAMETERS', {
			parameters: ['firstName', 'lastName'],
		})
	}

	@test()
	protected static async mapsInvalidParameters() {
		const err = this.Error([
			{
				code: 'invalid_value',
				name: 'phone',
			},
		])

		const errors = mapSchemaErrorsToParameterErrors(err)

		assert.isLength(errors, 1)
		errorAssertUtil.assertError(errors[0], 'INVALID_PARAMETERS', {
			parameters: ['phone'],
		})
	}

	@test()
	protected static async mapsUnexpectedParameters() {
		const err = this.Error([
			{
				code: 'unexpected',
				name: 'phone',
			},
		])

		const errors = mapSchemaErrorsToParameterErrors(err)

		assert.isLength(errors, 1)
		errorAssertUtil.assertError(errors[0], 'UNEXPECTED_PARAMETERS', {
			parameters: ['phone'],
		})
	}

	@test()
	protected static async mapsAll() {
		const err = this.Error([
			{
				code: 'unexpected',
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

		const errors = mapSchemaErrorsToParameterErrors(err)

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
		return new SpruceError({
			code: 'INVALID_FIELD',
			schemaId: 'testPerson',
			schemaName: 'A test person',
			errors,
		})
	}
}
