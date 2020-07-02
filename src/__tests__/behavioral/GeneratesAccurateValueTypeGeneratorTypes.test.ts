import { assert, test } from '@sprucelabs/test'
import { FieldDefinition } from '#spruce/schemas/fields/fields.types'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import { TextField, NumberField, SelectField, SchemaField } from '../../fields'
import AbstractField from '../../fields/AbstractField'

export default class GeneratesAccurateValueTypeGeneratorTypesTest extends AbstractSchemaTest {
	@test(
		'TextField generates expected',
		TextField,
		"ITextFieldDefinition['value']"
	)
	@test(
		'NumberField generates expected',
		NumberField,
		"INumberFieldDefinition['value']"
	)
	@test(
		'Select field generates expected',
		SelectField,
		'SelectValueTypeGenerator<F extends ISelectFieldDefinition ? F: ISelectFieldDefinition>'
	)
	@test(
		'Schema field generates expected',
		SchemaField,
		'SchemaFieldValueTypeGenerator<F extends ISchemaFieldDefinition? F : ISchemaFieldDefinition, CreateSchemaInstances>'
	)
	protected static textFieldGeneratesAsExpected(
		Field: AbstractField<FieldDefinition>,
		expected: string
	) {
		// @ts-ignore
		const type = Field.valueTypeGeneratorType
		assert.isEqual(type, expected)
	}
}
