import BaseTest, { test, assert } from '@sprucelabs/test'
import FieldFactory from '../../factories/FieldFactory'
import buildPersonWithCar, { IPersonDefinition } from '../data/personWithCars'

export default class SchemaFieldTest extends BaseTest {
	private static personDefinition: IPersonDefinition

	protected static async beforeEach() {
		super.beforeEach()
		const { personDefinition } = buildPersonWithCar()
		this.personDefinition = personDefinition
	}

	@test('fails on non-object', true, ['value_must_be_object'])
	@test(
		'passes because everything has name and a string is good',
		{ name: 'cheese!' },
		[]
	)
	@test("knows it's missing the name and name is required", { taco: true }, [
		'invalid_related_schema_values',
	])
	protected static async testNonUnionValidation(
		value: any,
		expectedErrorCodes: string[]
	) {
		const requiredField = FieldFactory.field(
			'requiredCar',
			this.personDefinition.fields.requiredCar
		)
		const optionalField = FieldFactory.field(
			'optionalCar',
			this.personDefinition.fields.optionalCar
		)
		const requiredIsArrayField = FieldFactory.field(
			'requiredIsArrayCar',
			this.personDefinition.fields.requiredIsArrayCars
		)
		const optionalIsArrayField = FieldFactory.field(
			'optionalRequiredCar',
			this.personDefinition.fields.optionalIsArrayCars
		)

		let codes = requiredField.validate(value).map((err) => err.code)
		assert.isEqualDeep(codes, expectedErrorCodes)

		codes = optionalField.validate(value).map((err) => err.code)
		assert.isEqualDeep(codes, expectedErrorCodes)

		codes = requiredIsArrayField.validate(value).map((err) => err.code)
		assert.isEqualDeep(codes, expectedErrorCodes)

		codes = optionalIsArrayField.validate(value).map((err) => err.code)
		assert.isEqualDeep(codes, expectedErrorCodes)
	}
}
