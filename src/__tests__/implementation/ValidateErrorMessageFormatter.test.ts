import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { errorAssertUtil } from '@sprucelabs/test-utils'
import { ValidationFailedErrorOptions } from '../../errors/options.types'
import SpruceError from '../../errors/SpruceError'
import {
	RenderOptions,
	ValidateErrorMessageFormatter,
} from '../../errors/ValidateErrorMessageFormatter'

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
				errors: [
					{
						code: 'INVALID_PARAMETER',
						name: 'firstName',
					},
				],
			}),
			'1 error!'
		)
		assert.doesInclude(
			this.renderError({
				errors: [
					{
						code: 'INVALID_PARAMETER',
						name: 'firstName',
					},
					{
						code: 'INVALID_PARAMETER',
						name: 'lastName',
					},
				],
			}),
			'2 errors!'
		)
	}

	@test()
	protected static async canCountNestedErrors() {
		assert.doesInclude(
			this.renderError({
				errors: [
					{
						code: 'INVALID_PARAMETER',
						name: 'favoriteColor',
						errors: [
							{
								code: 'MISSING_PARAMETER',
								name: 'name',
							},
							{
								code: 'MISSING_PARAMETER',
								name: 'rgb',
							},
						],
					},
				],
			}),
			'2 errors'
		)
	}

	@test()
	protected static async outputsAllTheFieldsAThatAreWrong() {
		const name1 = `${new Date().getTime()}`
		const name2 = `${new Date().getTime() * 2}`

		const msg = this.renderError({
			errors: [
				{
					code: 'INVALID_PARAMETER',
					name: name1,
				},
				{
					code: 'MISSING_PARAMETER',
					name: name2,
				},
				{
					code: 'MISSING_PARAMETER',
					name: 'rgb',
				},
			],
		})

		assert.doesInclude(msg, new RegExp(`${name1}.*is.*invalid`, `gis`))
		assert.doesInclude(msg, new RegExp(`${name2}.*is.*required`, `gis`))
		assert.doesInclude(msg, new RegExp(`rgb.*is.*required`, `gis`))
	}

	@test()
	protected static async outputsAllTheFieldsAThatAreWrongIncludingNested() {
		const name1 = `${new Date().getTime()}`
		const name2 = `${new Date().getTime() * 2}`

		const msg = this.renderError({
			errors: [
				{
					code: 'INVALID_PARAMETER',
					name: name1,
					errors: [
						{
							code: 'MISSING_PARAMETER',
							name: name2,
						},
						{
							code: 'MISSING_PARAMETER',
							name: 'rgb',
						},
					],
				},
			],
		})

		assert.doesNotInclude(msg, new RegExp(`${name1}.*is.*invalid`, `gis`))
		assert.doesInclude(
			msg,
			new RegExp(`${name1}.${name2}.*is.*required`, `gis`)
		)
		assert.doesNotInclude(msg, new RegExp(`${name1}.*has 2 errors`, `gis`))
	}

	@test()
	protected static rendersFriendlyMessageIfItExists() {
		const msg = this.renderError({
			errors: [
				{
					code: 'INVALID_PARAMETER',
					name: 'firstName',
					friendlyMessage: 'This is crazy!',
				},
			],
		})

		assert.doesInclude(msg, '1. (firstName) This is crazy!')
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
