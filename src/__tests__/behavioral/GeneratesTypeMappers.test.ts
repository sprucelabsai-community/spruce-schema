import BaseTest, { assert, test } from '@sprucelabs/test'
import { BooleanField, SelectField, SchemaField } from '../../fields'
import AbstractField from '../../fields/AbstractField'

export default class GeneratesRelationshipTemplatesTest extends BaseTest {
	@test('Boolean field', BooleanField, undefined)
	@test('Select field', SelectField, 'SelectFieldValueTypeMapper')
	@test(
		'Schema field',
		SchemaField,
		'SchemaFieldValueTypeMapper<F extends ISchemaFieldDefinition? F : ISchemaFieldDefinition, CreateEntityInstances>'
	)
	protected static async testValueGeneratorType(
		Field: typeof AbstractField,
		expected: string | undefined
	) {
		assert.isEqual(Field.generateTypeDetails().valueTypeMapper, expected)
	}
}
