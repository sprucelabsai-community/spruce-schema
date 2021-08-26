import { test, assert } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import FieldFactory from '../../factories/FieldFactory'

export default class TextFieldTest extends AbstractSchemaTest {
	@test()
	protected static async zeroLengthStringFailsValidationWhenRequired() {
		const field = FieldFactory.Field('firstName', {
			type: 'text',
			isRequired: true,
		})

		const errors = field.validate('')

		assert.isAbove(errors.length, 0)
		assert.isEqual(errors[0].code, 'MISSING_PARAMETER')
	}
}
