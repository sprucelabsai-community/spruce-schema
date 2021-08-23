import AbstractSpruceError from '@sprucelabs/error'
import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { errorAssertUtil } from '@sprucelabs/test-utils'
import { ValidationFailedErrorOptions } from '../../errors/error.options'
import SpruceError from '../../errors/SpruceError'
import mapFieldErrorsToParameterErrors from '../../utilities/mapFieldErrorsToParameterErrors'

interface RenderOptions {
	shouldUseReadableNames?: boolean
}

class ValidateErrorMessageFormatter {
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

	public render(options?: RenderOptions) {
		const totalErrors = this.getTotalErrors()

		let message = `'${this.renderSchemaName(
			options?.shouldUseReadableNames
		)}' has ${totalErrors} error${totalErrors === 1 ? '' : 's'}!\n\n`

		const errors = this.error.options.errors
		let count = 0
		for (const error of errors) {
			const name = error.options.errors?.[0]?.name
			message += `${count}. '${name}' is invalid!\n`
			count++
		}

		return message
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
}

export default class ValidateErrorMessageFormatterTest extends AbstractSpruceTest {
	@test()
	protected static async throwsWhenMissingValidateError() {
		//@ts-ignore
		const err = assert.doesThrow(() => this.Formatter())
		errorAssertUtil.assertError(err, 'MISSING_PARAMETERS', {
			parameters: ['error'],
		})
	}

	@test()
	protected static async throwsWhenSentBadErrorCode() {
		const err = assert.doesThrow(() =>
			this.Formatter(
				//@ts-ignore
				new SpruceError({ code: 'MISSING_PARAMETERS', parameters: [] })
			)
		)
		errorAssertUtil.assertError(err, 'INVALID_PARAMETERS', {
			parameters: ['error'],
		})
	}

	@test()
	protected static async throwsWhenSentBadError() {
		const err = assert.doesThrow(
			//@ts-ignore
			() => this.Formatter(new Error('yay'))
		)
		errorAssertUtil.assertError(err, 'INVALID_PARAMETERS', {
			parameters: ['error'],
		})
	}

	@test('renders schemaId by default')
	@test('renders schemaName with shouldUseReadableNames', {
		shouldUseReadableNames: true,
	})
	protected static async outputsSchemaIdOrName(options?: RenderOptions) {
		const schemaId = `${new Date().getTime()}`
		const schemaName = `${new Date().getTime() * 2}`

		const message = this.renderError({ schemaId, schemaName }, options)

		if (options?.shouldUseReadableNames) {
			assert.doesInclude(message, schemaName)
		} else {
			assert.doesInclude(message, schemaId)
		}
	}

	@test()
	protected static async showAccurateCountOfErrors() {
		assert.doesInclude(this.renderError({ errors: [] }), '0 errors')
		assert.doesInclude(
			this.renderError({
				errors: mapFieldErrorsToParameterErrors([
					{
						code: 'invalid_value',
						name: 'firstName',
					},
				]),
			}),
			'1 error!'
		)
		assert.doesInclude(
			this.renderError({
				errors: mapFieldErrorsToParameterErrors([
					{
						code: 'invalid_value',
						name: 'firstName',
					},
					{
						code: 'invalid_value',
						name: 'lastName',
					},
				]),
			}),
			'2 errors!'
		)
	}

	@test()
	protected static async canCountNestedErrors() {
		assert.doesInclude(
			this.renderError({
				errors: mapFieldErrorsToParameterErrors([
					{
						code: 'invalid_value',
						name: 'favoriteColor',
						error: this.ValidationError({
							errors: mapFieldErrorsToParameterErrors([
								{
									code: 'missing_required',
									name: 'name',
								},
								{
									code: 'missing_required',
									name: 'rgb',
								},
							]),
						}),
					},
				]),
			}),
			'2 errors'
		)
	}

	@test()
	protected static async outputsAllTheFieldsAThatAreWrong() {
		const name1 = `${new Date().getTime()}`
		const name2 = `${new Date().getTime() * 2}`

		const msg = this.renderError({
			errors: mapFieldErrorsToParameterErrors([
				{
					code: 'invalid_value',
					name: name1,
				},
				{
					code: 'missing_required',
					name: name2,
				},
				{
					code: 'missing_required',
					name: 'rgb',
				},
			]),
		})

		assert.doesInclude(msg, new RegExp(`${name1}.*is.*invalid`, `gis`))
		assert.doesInclude(msg, new RegExp(`${name2}.*is.*required`, `gis`))
	}

	@test()
	protected static async outputsAllTheFieldsAThatAreWrongIncludingNested() {
		const name1 = `${new Date().getTime()}`
		const name2 = `${new Date().getTime() * 2}`

		const msg = this.renderError({
			errors: mapFieldErrorsToParameterErrors([
				{
					code: 'invalid_value',
					name: name1,
					error: this.ValidationError({
						errors: mapFieldErrorsToParameterErrors([
							{
								code: 'missing_required',
								name: name2,
							},
							{
								code: 'missing_required',
								name: 'rgb',
							},
						]),
					}),
				},
			]),
		})

		assert.doesInclude(msg, new RegExp(`${name1}.*is.*invalid`, `gis`))
		assert.doesInclude(msg, new RegExp(`${name2}.*is.*required`, `gis`))
	}

	private static renderError(
		errorOptions?: Partial<ValidationFailedErrorOptions>,
		renderOptions?: RenderOptions | undefined
	) {
		const error = this.ValidationError(errorOptions)
		const formatter = this.Formatter(error)
		const message = formatter.render(renderOptions)
		return message
	}

	private static ValidationError(
		options?: Partial<ValidationFailedErrorOptions>
	) {
		return new SpruceError({
			code: 'VALIDATION_FAILED',
			schemaId: `${Math.random()}`,
			schemaName: `${Math.random() * 2} name`,
			errors: [],
			...options,
		})
	}

	private static Formatter(error: SpruceError) {
		return new ValidateErrorMessageFormatter(error as any)
	}
}
