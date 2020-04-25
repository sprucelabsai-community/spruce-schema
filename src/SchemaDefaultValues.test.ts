import BaseTest, { test, ISpruce, assert } from '@sprucelabs/test'
import buildSchemaDefinition from './utilities/buildSchemaDefinition'
import { FieldType } from '#spruce:schema/fields/fieldType'
import { default as Schema } from './Schema'
import {
	FieldNamesWithDefaultValueSet,
	ISchemaDefinition
} from './schema.types'

export default class SchemaDefaultValuesTest extends BaseTest {
	private static wrenchDefinition = buildSchemaDefinition({
		id: 'wrench',
		name: 'Wrench',
		fields: {
			wrenchSize: {
				type: FieldType.Number,
				label: 'Size',
				defaultValue: 10
			},
			tags: {
				type: FieldType.Text,
				label: 'Tags',
				isArray: true,
				defaultValue: ['low', 'tough', 'tool']
			},
			color: {
				type: FieldType.Text,
				label: 'Color (w/ no default)'
			}
		}
	})

	private static screwdriverDefinition = buildSchemaDefinition({
		id: 'screwdriver',
		name: 'Screwdriver',
		fields: {
			type: {
				type: FieldType.Select,
				defaultValue: 'flathead',
				options: {
					choices: [
						{ value: 'flathead', label: 'Flathead' },
						{ value: 'screwdriver', label: 'Screwdriver' }
					]
				}
			},
			screwdriverLength: {
				type: FieldType.Number,
				label: 'Length'
			}
		}
	})

	private static personDefinition = buildSchemaDefinition({
		id: 'union-person',
		name: 'Union Person',
		fields: {
			favoriteTool: {
				type: FieldType.Schema,
				options: {
					schemas: [
						SchemaDefaultValuesTest.wrenchDefinition,
						SchemaDefaultValuesTest.screwdriverDefinition
					]
				},
				defaultValue: { wrenchSize: 100 }
			},
			leastFavoriteTool: {
				type: FieldType.Schema,
				options: {
					schemas: [
						SchemaDefaultValuesTest.wrenchDefinition,
						SchemaDefaultValuesTest.screwdriverDefinition
					]
				},
				defaultValue: SchemaDefaultValuesTest.wrenchDefinition
			},
			tools: {
				type: FieldType.Schema,
				isArray: true,
				defaultValue: [
					{
						schemaId: 'screwdriver',
						values: { screwDriverLength: 22 }
					}
				],
				options: {
					schemas: [
						SchemaDefaultValuesTest.wrenchDefinition,
						SchemaDefaultValuesTest.screwdriverDefinition
					]
				}
			}
		}
	})

	@test(
		'Test typing on default values with text and select fields (test will always pass, lint will fail)'
	)
	protected static textAndSelectDefaultValues() {
		let fieldName:
			| FieldNamesWithDefaultValueSet<
					typeof SchemaDefaultValuesTest.wrenchDefinition
			  >
			| undefined

		// make sure types are 100% (only works if they are currently undefined)
		assert.expectType<'wrenchSize' | 'tags' | undefined>(fieldName)
	}

	@test(
		'Typing on default values with schema fields (test will pass, lint will fail)'
	)
	protected static schemaFieldsDefaultValues() {
		let fieldName:
			| FieldNamesWithDefaultValueSet<
					typeof SchemaDefaultValuesTest.personDefinition
			  >
			| undefined

		// make sure types are 100% (only works if they are currently undefined)
		assert.expectType<
			'favoriteTool' | 'leastFavoriteTool' | 'tools' | undefined
		>(fieldName)
	}

	@test(
		'Can get default values number and text array',
		SchemaDefaultValuesTest.wrenchDefinition,
		{
			wrenchSize: 10,
			tags: []
		}
	)
	@test(
		'Can get default values choices',
		SchemaDefaultValuesTest.screwdriverDefinition,
		{
			type: 'flathead'
		}
	)
	@test(
		'Can get default values for schema fields',
		SchemaDefaultValuesTest.personDefinition,
		{
			favoriteTool: 10,
			leastFavoriteTool: false,
			tools: [{ schemaId: 'screwDriver' }]
		}
	)
	protected static defaultValueTests(
		s: ISpruce,
		definition: ISchemaDefinition,
		expectedDefaultValues: Record<string, any>
	) {
		const schema = new Schema(definition)
		const defaultValues = schema.getDefaultValues()
		assert.deepEqual(defaultValues, expectedDefaultValues)
	}
}
