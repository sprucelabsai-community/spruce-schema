import BaseTest, { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import SchemaField from '../../fields/SchemaField'
import { ISchemaFieldDefinition } from '../../fields/SchemaField.types'
import buildSchemaDefinition from '../../utilities/buildSchemaDefinition'

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
		{ id: 'user' }
	])
	@test(
		'can normalize schemaIds to array [schemaId]',
		{ schemaIds: ['user', 'wrench'] },
		[{ id: 'user' }, { id: 'wrench' }]
	)
	@test(
		'can normalize schemaIds to array [schemaId]',
		{ schemaIds: ['user', 'wrench'] },
		[{ id: 'user' }, { id: 'wrench' }]
	)
	@test(
		'can normalize schema to array [schemaId]',
		{ schema: SchemaFieldTemplateTest.wrenchDefinition },
		[{ id: 'wrench' }],
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
		[{ id: 'wrench' }, { id: 'screwdriver' }],
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
		[{ id: 'union-person' }, { id: 'wrench' }, { id: 'screwdriver' }],
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
		[{ id: 'union-person' }, { id: 'wrench' }, { id: 'screwdriver' }],
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
		[{ id: 'union-person' }, { id: 'wrench' }, { id: 'screwdriver' }],
		[
			{ id: 'union-person' },
			SchemaFieldTemplateTest.wrenchDefinition,
			SchemaFieldTemplateTest.screwdriverDefinition
		]
	)
	protected static async testNormalizingOptionsToId(
		options: ISchemaFieldDefinition['options'],
		toSchemaIdExpected: any,
		toSchemaOrIdExpected?: any
	) {
		const idsWithVersion = SchemaField.mapFieldDefinitionToSchemaIdsWithVersion(
			{
				type: FieldType.Schema,
				options
			}
		)
		assert.isEqualDeep(idsWithVersion, toSchemaIdExpected)

		const schemasOrIdsWithVersion = SchemaField.mapFieldDefinitionToSchemasOrIdsWithVersion(
			{
				type: FieldType.Schema,
				options
			}
		)
		assert.isEqualDeep(
			schemasOrIdsWithVersion,
			toSchemaOrIdExpected ?? toSchemaIdExpected
		)
	}
}
