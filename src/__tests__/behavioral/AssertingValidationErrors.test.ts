import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { errorAssertUtil } from '@sprucelabs/test-utils'
import { FieldErrorCode } from '../../errors/options.types'
import SpruceError from '../../errors/SpruceError'
import validationErrorAssertUtil, {
	ValidationErrorAssertOptionsKey,
} from '../../tests/validationErrorAssert.utility'

export default class AssertingValidationErrorsTest extends AbstractSpruceTest {
	@test()
	protected static canCreateAssertingValidationErrors() {
		assert.isFunction(validationErrorAssertUtil.assertError)
	}

	@test()
	protected static throwsWhenMissingErrorAndOptions() {
		const err = assert.doesThrow(
			//@ts-ignore
			() => validationErrorAssertUtil.assertError()
		)

		errorAssertUtil.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['error', 'options'],
		})
	}

	@test()
	protected static throwsWhenMissingOptions() {
		const err = assert.doesThrow(
			//@ts-ignore
			() => validationErrorAssertUtil.assertError(new Error('test'))
		)

		errorAssertUtil.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['options'],
		})
	}

	@test()
	protected static throwsWhenNotGettingSpruceError() {
		const err = assert.doesThrow(() =>
			//@ts-ignore
			validationErrorAssertUtil.assertError(new Error('test'), {
				missing: [],
			})
		)

		errorAssertUtil.assertError(err, 'INVALID_PARAMETERS', {
			parameters: ['error'],
		})
	}

	@test()
	protected static passesWhenJustReturnedError() {
		validationErrorAssertUtil.assertError(
			new SpruceError({
				code: 'VALIDATION_FAILED',
				schemaId: 'person',
				errors: [
					{
						code: 'MISSING_PARAMETER',
						name: 'test',
					},
				],
			}),
			{
				missing: ['test'],
			}
		)
	}

	@test()
	protected static failsWhenMissingNotFound() {
		assert.doesThrow(
			() =>
				validationErrorAssertUtil.assertError(
					new SpruceError({
						code: 'VALIDATION_FAILED',
						schemaId: 'person',
						errors: [],
					}),
					{
						missing: ['test'],
					}
				),
			/missing.*?test/gis
		)
	}

	@test()
	protected static failsWhenMissingNotFoundWithOtherErrors() {
		assert.doesThrow(
			() =>
				validationErrorAssertUtil.assertError(
					new SpruceError({
						code: 'VALIDATION_FAILED',
						schemaId: 'person',
						errors: [
							{
								code: 'INVALID_PARAMETER',
								name: 'taco',
							},
						],
					}),
					{
						missing: ['test'],
					}
				),
			/missing.*?test/gis
		)
	}

	@test()
	protected static failsWhenMissingIsNamedDifferently() {
		assert.doesThrow(
			() =>
				validationErrorAssertUtil.assertError(
					new SpruceError({
						code: 'VALIDATION_FAILED',
						schemaId: 'person',
						errors: [
							{
								code: 'MISSING_PARAMETER',
								name: 'taco',
							},
						],
					}),
					{
						missing: ['cheesy'],
					}
				),
			/missing.*?cheesy/gis
		)
	}

	@test(
		'fails when matches only 1 missing',
		'MISSING_PARAMETER',
		'missing',
		/missing.*?cheesy/
	)
	@test(
		'fails when matches only 1 invalid',
		'INVALID_PARAMETER',
		'invalid',
		/invalid.*?cheesy/
	)
	@test(
		'fails when matches only 1 unexpected',
		'UNEXPECTED_PARAMETER',
		'unexpected',
		/unexpected.*?cheesy/
	)
	protected static failsWhenOneOfTwoMatches(
		code: FieldErrorCode,
		key: ValidationErrorAssertOptionsKey,
		search: RegExp
	) {
		assert.doesThrow(
			() =>
				validationErrorAssertUtil.assertError(
					new SpruceError({
						code: 'VALIDATION_FAILED',
						schemaId: 'person',
						errors: [
							{
								code,
								name: 'taco',
							},
						],
					}),
					{
						[key]: ['taco', 'cheesy'],
					}
				),
			search
		)
	}

	@test('matching missing', 'MISSING_PARAMETER', 'missing')
	@test('matching invalid', 'INVALID_PARAMETER', 'invalid')
	@test('matching unexpected', 'UNEXPECTED_PARAMETER', 'unexpected')
	protected static matches(
		code: FieldErrorCode,
		key: ValidationErrorAssertOptionsKey
	) {
		validationErrorAssertUtil.assertError(
			new SpruceError({
				code: 'VALIDATION_FAILED',
				schemaId: 'person',
				errors: [
					{
						code,
						name: 'test',
					},
				],
			}),
			{
				[key]: ['test'],
			}
		)
	}

	@test()
	protected static throwsWhenCodeMissmatches() {
		assert.doesThrow(() =>
			validationErrorAssertUtil.assertError(
				new SpruceError({
					code: 'VALIDATION_FAILED',
					schemaId: 'person',
					errors: [
						{
							code: 'MISSING_PARAMETER',
							name: 'taco',
						},
					],
				}),
				{
					invalid: ['taco'],
				}
			)
		)
	}

	@test()
	protected static matchesNestedParameters() {
		validationErrorAssertUtil.assertError(
			new SpruceError({
				code: 'VALIDATION_FAILED',
				schemaId: 'person',
				errors: [
					{
						code: 'INVALID_PARAMETER',
						name: 'test',
						errors: [
							{
								code: 'MISSING_PARAMETER',
								name: 'turkey',
							},
						],
					},
				],
			}),
			{
				missing: ['test.turkey'],
			}
		)
	}

	@test()
	protected static throwWhenMissingOnNested() {
		assert.doesThrow(() =>
			validationErrorAssertUtil.assertError(
				new SpruceError({
					code: 'VALIDATION_FAILED',
					schemaId: 'person',
					errors: [
						{
							code: 'INVALID_PARAMETER',
							name: 'taco',
							errors: [
								{
									code: 'UNEXPECTED_PARAMETER',
									name: 'bravo',
								},
							],
						},
					],
				}),
				{
					invalid: ['taco.bravo'],
				}
			)
		)
	}
}
