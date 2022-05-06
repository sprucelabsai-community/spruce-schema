import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import FieldFactory from '../../factories/FieldFactory'
import {
	FieldDefinitions,
	FileField,
	FileFieldDefinition,
	FileFieldValue,
	SupportedFileType,
} from '../../fields'
import buildSchema from '../../utilities/buildSchema'

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
		this.field = this.Field({
			options: {
				acceptableTypes: ['image/png', 'application/pdf'],
			},
		})

		this.assertNoErrorWithPdf()
	}

	private static assertNoErrorWithPdf() {
		assert.isLength(
			this.field.validate({
				name: 'yes',
				type: 'application/pdf',
				uri: 'uoaue',
			}),
			0
		)
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
