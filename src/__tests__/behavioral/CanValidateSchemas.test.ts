import { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import buildSchemaDefinition from '../../utilities/buildSchemaDefinition'
import isSchemaValid from '../../utilities/isSchemaValid'
import validateSchemaValues from '../../utilities/validateSchemaValues'

export default class CanValidateSchemasTest extends AbstractSchemaTest {
	private static personDefinition = buildSchemaDefinition({
		id: 'testPerson',
		name: 'A test person',
		fields: {
			firstName: {
				type: FieldType.Text,
				isRequired: true,
			},
			lastName: {
				type: FieldType.Text,
				isRequired: true,
			},
		},
	})

	protected static async beforeEach() {
		super.beforeEach()
	}

	@test()
	protected static async canValidateBasicSchema() {
		const err = assert.doesThrow(
			() => validateSchemaValues(this.personDefinition, {}),
			/firstName is required/gi
		)

		assert.doesInclude(err.message, /lastName is required/gi)
	}

	@test()
	protected static async canValidateSpecificFields() {
		const err = assert.doesThrow(() =>
			validateSchemaValues(this.personDefinition, {}, { fields: ['firstName'] })
		)

		assert.doesNotInclude(err.message, /lastName/gi)
	}

	@test()
	protected static async canCheckValidityWithoutThrowing() {
		const isValid = isSchemaValid(this.personDefinition, {})
		assert.isFalse(isValid)
	}

	@test()
	protected static async canCheckValidityOnSpecificFields() {
		const isValid = isSchemaValid(
			this.personDefinition,
			{ firstName: 'test' },
			{ fields: ['firstName'] }
		)
		assert.isTrue(isValid)
	}

	@test()
	protected static async failsOnSpecificFields() {
		const isValid = isSchemaValid(
			this.personDefinition,
			{ firstName: 'test' },
			{ fields: ['lastName'] }
		)
		assert.isFalse(isValid)
	}
}
