import BaseTest, { test, assert, ISpruce } from '@sprucelabs/test'
import { personDefinition } from './__mocks__/personWithCars'
import FieldFactory from '../factories/FieldFactory'

export default class SchemaFieldTest extends BaseTest {
	@test('fails on non-object', true, ['value_must_be_object'])
	@test(
		'passes because everything has name and a string is good',
		{ name: 'cheese!' },
		[]
	)
	@test("knows it's missing the name and name is required", { taco: true }, [
		'invalid_related_schema_values'
	])
	protected static async testNonUnionValidation(
		s: ISpruce,
		value: any,
		expectedErrorCodes: string[]
	) {
		const requiredField = FieldFactory.field(
			'requiredCar',
			personDefinition.fields.requiredCar
		)
		const optionalField = FieldFactory.field(
			'optionalCar',
			personDefinition.fields.optionalCar
		)
		const requiredIsArrayField = FieldFactory.field(
			'requiredIsArrayCar',
			personDefinition.fields.requiredIsArrayCars
		)
		const optionalIsArrayField = FieldFactory.field(
			'optionalRequiredCar',
			personDefinition.fields.optionalIsArrayCars
		)

		let codes = requiredField.validate(value).map(err => err.code)
		assert.deepEqual(codes, expectedErrorCodes)

		codes = optionalField.validate(value).map(err => err.code)
		assert.deepEqual(codes, expectedErrorCodes)

		codes = requiredIsArrayField.validate(value).map(err => err.code)
		assert.deepEqual(codes, expectedErrorCodes)

		codes = optionalIsArrayField.validate(value).map(err => err.code)
		assert.deepEqual(codes, expectedErrorCodes)
	}
}
