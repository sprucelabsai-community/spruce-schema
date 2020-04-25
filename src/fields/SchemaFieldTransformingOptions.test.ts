import BaseTest, { test, assert, ISpruce } from '@sprucelabs/test'
import buildSchemaDefinition from '../utilities/buildSchemaDefinition'
import { FieldType } from '#spruce:schema/fields/fieldType'
import SchemaField, { ISchemaFieldDefinition } from './SchemaField'

export default class SchemaFieldTemplateTest extends BaseTest {
	private static wrenchDefinition = buildSchemaDefinition({
		id: 'wrench',
		name: 'Wrench',
		fields: {
			wrenchSize: {
				type: FieldType.Number,
				label: 'Size'
			}
		}
	})

	private static screwdriverDefinition = buildSchemaDefinition({
		id: 'screwdriver',
		name: 'Screwdriver',
		fields: {
			isFlathead: {
				type: FieldType.Boolean
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
						SchemaFieldTemplateTest.wrenchDefinition,
						SchemaFieldTemplateTest.screwdriverDefinition
					]
				}
			},
			tools: {
				type: FieldType.Schema,
				isArray: true,
				options: {
					schemas: [
						SchemaFieldTemplateTest.wrenchDefinition,
						SchemaFieldTemplateTest.screwdriverDefinition
					]
				}
			}
		}
	})

	@test('can normalize schemaId to array [schemaId]', { schemaId: 'user' }, [
		'user'
	])
	@test(
		'can normalize schemaIds to array [schemaId]',
		{ schemaIds: ['user', 'wrench'] },
		['user', 'wrench']
	)
	@test(
		'can normalize schemaIds to array [schemaId]',
		{ schemaIds: ['user', 'wrench'] },
		['user', 'wrench']
	)
	@test(
		'can normalize schema to array [schemaId]',
		{ schema: SchemaFieldTemplateTest.wrenchDefinition },
		['wrench'],
		[SchemaFieldTemplateTest.wrenchDefinition]
	)
	@test(
		'can normalize schemas to array [schemaId]',
		{
			schemas: [
				SchemaFieldTemplateTest.wrenchDefinition,
				SchemaFieldTemplateTest.screwdriverDefinition
			]
		},
		['wrench', 'screwdriver'],
		[
			SchemaFieldTemplateTest.wrenchDefinition,
			SchemaFieldTemplateTest.screwdriverDefinition
		]
	)
	@test(
		'can normalize schema, schemas to array [schemaId]',
		{
			schema: SchemaFieldTemplateTest.personDefinition,
			schemas: [
				SchemaFieldTemplateTest.wrenchDefinition,
				SchemaFieldTemplateTest.screwdriverDefinition
			]
		},
		['union-person', 'wrench', 'screwdriver'],
		[
			SchemaFieldTemplateTest.personDefinition,
			SchemaFieldTemplateTest.wrenchDefinition,
			SchemaFieldTemplateTest.screwdriverDefinition
		]
	)
	@test(
		'can normalize schemas, schema to array [schemaId]',
		{
			schemas: [
				SchemaFieldTemplateTest.wrenchDefinition,
				SchemaFieldTemplateTest.screwdriverDefinition
			],
			schema: SchemaFieldTemplateTest.personDefinition
		},
		['union-person', 'wrench', 'screwdriver'],
		[
			SchemaFieldTemplateTest.personDefinition,
			SchemaFieldTemplateTest.wrenchDefinition,
			SchemaFieldTemplateTest.screwdriverDefinition
		]
	)
	@test(
		'can normalize schemas, schemaId to array [schemaId]',
		{
			schemas: [
				SchemaFieldTemplateTest.wrenchDefinition,
				SchemaFieldTemplateTest.screwdriverDefinition
			],
			schemaId: 'union-person'
		},
		['union-person', 'wrench', 'screwdriver'],
		[
			'union-person',
			SchemaFieldTemplateTest.wrenchDefinition,
			SchemaFieldTemplateTest.screwdriverDefinition
		]
	)
	protected static async testNormalizingOptionsToId(
		_: ISpruce,
		options: ISchemaFieldDefinition['options'],
		toSchemaIdExpected: string[],
		toSchemaOrIdExpected?: string[]
	) {
		const ids = SchemaField.fieldDefinitionToSchemaIds({
			type: FieldType.Schema,
			options
		})
		assert.deepEqual(ids, toSchemaIdExpected)

		const schemasOrIds = SchemaField.fieldDefinitionToSchemasOrIds({
			type: FieldType.Schema,
			options
		})
		assert.deepEqual(schemasOrIds, toSchemaOrIdExpected ?? toSchemaIdExpected)
	}
}
