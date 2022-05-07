import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import FieldFactory from '../../factories/FieldFactory'
import ImageField from '../../fields/ImageField'
import {
	ImageFieldDefinition,
	ImageFieldValue,
	RequiredImageSize,
} from '../../fields/ImageField.types'

export default class ImageFieldTest extends AbstractSpruceTest {
	private static field: ImageField
	protected static async beforeEach() {
		await super.beforeEach()
		this.field = this.Field()
	}

	@test()
	protected static throwsWhenMissingIfRequired() {
		this.field = this.Field({ isRequired: true })
		this.assertValueReturnsExpectedError(null as any, 'MISSING_PARAMETER')
	}

	@test('fails with missmatched size 1', ['s'], {
		lUri: 'spruce.bot',
	})
	@test('fails with missmatched size 2', ['s', 'l'], {
		sUri: 'spruce.bot',
	})
	@test('fails with missmatched size 2', ['s', 'm', 'l'], {
		sUri: 'spruce.bot',
	})
	protected static throwsWHenMissingRequiredSize(
		sizes: RequiredImageSize[],
		value: Partial<ImageFieldValue>
	) {
		this.setSizes(sizes)
		this.assertValueReturnsExpectedError(value, 'INVALID_PARAMETER')
	}

	@test('passes with all sizes 1', ['l'], { lUri: 'apple.com' })
	@test('passes with all sizes 2', ['l', 's'], {
		lUri: 'apple.com',
		sUri: 'spruce.bot',
	})
	@test('passes with wildcard', ['*'], {
		xxsUri: 'spruce.bot',
		xsUri: 'spruce.bot',
		sUri: 'spruce.bot',
		mUri: 'spruce.bot',
		lUri: 'spruce.bot',
		xlUri: 'spruce.bot',
		xxlUri: 'spruce.bot',
	})
	protected static passesWhenHasSize(
		sizes: RequiredImageSize[],
		value: Partial<ImageFieldValue>
	) {
		this.setSizes(sizes)
		this.assertNoErrors(value)
	}

	@test()
	protected static passesWithAcceptableValues() {
		this.assertNoErrors({
			base64: 'waka',
		})
		this.assertNoErrors(null)
	}

	private static assertNoErrors(value: Partial<ImageFieldValue> | null) {
		const errs = this.validate(value)
		assert.isLength(errs, 0)
	}

	private static setSizes(sizes: RequiredImageSize[]) {
		this.field = this.Field({ options: { requiredSizes: sizes } })
	}

	private static assertValueReturnsExpectedError(
		value: Partial<ImageFieldValue>,
		code: string
	) {
		const errs = this.validate(value)
		assert.isLength(errs, 1, `I expected 1 error but got ${errs.length}`)
		assert.isEqual(errs[0].code, code)
		assert.isEqual(errs[0].name, this.field.name)
	}

	private static validate(value: Partial<ImageFieldValue> | null) {
		return this.field.validate(value ? { name: 'avatar.png', ...value } : value)
	}

	private static Field(options?: Partial<ImageFieldDefinition>): ImageField {
		return FieldFactory.Field(`test-${new Date().getTime()}`, {
			type: 'image',
			options: {
				requiredSizes: ['*'],
			},
			...(options as any),
		}) as ImageField
	}
}
