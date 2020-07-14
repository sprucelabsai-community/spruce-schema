import { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import buildSchemaDefinition from '../../utilities/buildSchemaDefinition'
import normalizeSchemaValues from '../../utilities/normalizeSchemaValues'

export default class NormalizingSchemaValues extends AbstractSchemaTest {
	private static personDefinition = buildSchemaDefinition({
		id: 'testPerson',
		name: 'A test person',
		fields: {
			firstName: {
				type: FieldType.Text,
				isRequired: true,
			},
			age: {
				type: FieldType.Number,
			},
		},
	})

	@test()
	protected static normalizesSimpleAsExpected() {
		const values = normalizeSchemaValues(this.personDefinition, {
			// @ts-ignore
			firstName: 12345,
			// @ts-ignore
			age: '10',
		})

		assert.isEqualDeep(values, { firstName: '12345', age: 10 })
	}

	@test()
	protected static normalizeTypesAsExpected() {
		const values = normalizeSchemaValues(this.personDefinition, {
			firstName: 'tay',
			age: 0,
		})

		assert.isType<{ firstName: string; age?: number | null }>(values)
	}
}
