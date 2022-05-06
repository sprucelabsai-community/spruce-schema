import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { FieldError } from '../../errors/options.types'
import FieldFactory from '../../factories/FieldFactory'
import {
	FileField,
	FileFieldDefinition,
	FileFieldValue,
	SupportedFileType,
} from '../../fields'

export default class FileFieldTest extends AbstractSpruceTest {
	private static field: FileField
	protected static async beforeEach(): Promise<void> {
		await super.beforeEach()
		this.field = this.Field()
	}

	@test()
	protected static throwsWhenRequiredAndMissing() {
		this.field = this.RequiredField()
		const errorCode = 'MISSING_PARAMETER'
		const value = null
		//@ts-ignore
		this.assertValueProducesError(value, errorCode)

		this.assertNoErrorWithPdf()
	}

	@test('accepted types', ['image/jpeg'], 'image/png')
	@test('accepted types', ['image/png'], 'image/jpeg')
	protected static throwsWithUnsuportedType(
		acceptableTypes: SupportedFileType[],
		type: SupportedFileType
	) {
		this.field = this.Field({
			options: { acceptableTypes },
		})

		this.assertValueProducesError(
			{
				name: 'taco',
				type,
			},
			'INVALID_PARAMETER'
		)
	}

	@test()
	protected static matchesWhenAcceptableMatchIsNotFirst() {
		this.setTypes(['image/png', 'application/pdf'])
		this.assertNoErrorWithPdf()
	}

	@test()
	protected static async base64DoesNotThrow() {
		this.setTypes(['image/png', 'application/pdf'])
		this.assertNoError({
			base64: 'waka',
		})
	}

	private static setTypes(types: SupportedFileType[]) {
		this.field = this.Field({
			options: {
				acceptableTypes: types,
			},
		})
	}

	private static assertNoErrorWithPdf() {
		this.assertNoError({
			name: 'yes',
			type: 'application/pdf',
			uri: 'uoaue',
		})
	}

	private static assertNoError(value: Partial<FileFieldValue>) {
		assert.isLength(this.validate({ name: 'test', ...value }), 0)
	}

	private static validate(
		value: FileFieldValue
	): FieldError[] | null | undefined {
		return this.field.validate(value)
	}

	private static RequiredField() {
		return this.Field({ isRequired: true })
	}

	private static Field(options?: Partial<FileFieldDefinition>): FileField {
		return FieldFactory.Field(`test-${new Date().getTime()}`, {
			type: 'file',
			options: { acceptableTypes: ['*'] },
			...(options as any),
		}) as any
	}

	private static assertValueProducesError(
		value: FileFieldValue,
		errorCode: string
	) {
		//@ts-ignore
		let errors = this.field.validate(value)
		assert.isLength(
			errors,
			1,
			'I expected 1 error back from validate and got ' + errors.length
		)
		assert.isEqual(errors[0].code, errorCode)
		assert.isEqual(errors[0].name, this.field.name)
	}
}
