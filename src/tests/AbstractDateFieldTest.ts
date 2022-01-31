import { assert } from '@sprucelabs/test'
import StaticSchemaEntityImplementation, { validationErrorAssert } from '..'
import AbstractSchemaTest from '../AbstractSchemaTest'
import SchemaEntityFactory from '../factories/SchemaEntityFactory'

export default abstract class AbstractDateFieldTest extends AbstractSchemaTest {
	protected static schema: any
	protected static entity: StaticSchemaEntityImplementation<any>

	protected static async beforeEach(): Promise<void> {
		await super.beforeEach()
		this.entity = SchemaEntityFactory.Entity(this.schema) as any
	}

	protected static canSetDateAsDateObject() {
		//@ts-ignore
		this.entity.set('optionalBirthday', new Date())
	}

	protected static failsValidationIfPassedString(fieldName: any, value: any) {
		const err = assert.doesThrow(() =>
			//@ts-ignore
			this.entity.set(fieldName, value)
		)

		validationErrorAssert.assertError(err, { invalid: [fieldName] })
	}

	protected static honorsRequired() {
		assert.isFalse(this.entity.isValid())
		this.entity.set('requiredBirthday', new Date().getTime())
		assert.isTrue(this.entity.isValid())
	}
}
