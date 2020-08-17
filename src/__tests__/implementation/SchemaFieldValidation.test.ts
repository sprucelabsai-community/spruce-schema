import BaseTest, { test, assert } from '@sprucelabs/test'
import FieldFactory from '../../factories/FieldFactory'
import buildPersonWithCar, { IPersonSchema } from '../data/personWithCars'

export default class SchemaFieldTest extends BaseTest {
	private static personSchema: IPersonSchema

	protected static async beforeEach() {
		super.beforeEach()
		const { personSchema } = buildPersonWithCar()
		this.personSchema = personSchema
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
		const requiredField = FieldFactory.Field(
			'requiredCar',
			this.personSchema.fields.requiredCar
		)
		const optionalField = FieldFactory.Field(
			'optionalCar',
			this.personSchema.fields.optionalCar
		)
		const requiredIsArrayField = FieldFactory.Field(
			'requiredIsArrayCar',
			this.personSchema.fields.requiredIsArrayCars
		)
		const optionalIsArrayField = FieldFactory.Field(
			'optionalRequiredCar',
			this.personSchema.fields.optionalIsArrayCars
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
