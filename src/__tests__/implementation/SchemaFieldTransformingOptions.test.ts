import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import SchemaField from '../../fields/SchemaField'
import { ISchemaFieldDefinition } from '../../fields/SchemaField.types'
import buildSchema from '../../utilities/buildSchema'

export default class SchemaFieldTemplateTest extends AbstractSpruceTest {
	private static wrenchSchema = buildSchema({
		id: 'wrench',
		name: 'Wrench',
		fields: {
			wrenchSize: {
				type: 'number',
				label: 'Size',
			},
		},
	})

	private static screwdriverSchema = buildSchema({
		id: 'screwdriver',
		name: 'Screwdriver',
		fields: {
			isFlathead: {
				type: 'boolean',
			},
			screwdriverLength: {
				type: 'number',
				label: 'Length',
			},
		},
	})

	private static personSchema = buildSchema({
		id: 'union-person',
		name: 'Union Person',
		fields: {
			favoriteTool: {
				type: 'schema',
				options: {
					schemas: [
						SchemaFieldTemplateTest.wrenchSchema,
						SchemaFieldTemplateTest.screwdriverSchema,
					],
				},
			},
			tools: {
				type: 'schema',
				isArray: true,
				options: {
					schemas: [
						SchemaFieldTemplateTest.wrenchSchema,
						SchemaFieldTemplateTest.screwdriverSchema,
					],
				},
			},
		},
	})

	@test('can normalize schemaId to array [schemaId]', { schemaId: 'user' }, [
		{ id: 'user' },
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
		{ schema: SchemaFieldTemplateTest.wrenchSchema },
		[{ id: 'wrench' }],
		[SchemaFieldTemplateTest.wrenchSchema]
	)
	@test(
		'can normalize schemas to array [schemaId]',
		{
			schemas: [
				SchemaFieldTemplateTest.wrenchSchema,
				SchemaFieldTemplateTest.screwdriverSchema,
			],
		},
		[{ id: 'wrench' }, { id: 'screwdriver' }],
		[
			SchemaFieldTemplateTest.wrenchSchema,
			SchemaFieldTemplateTest.screwdriverSchema,
		]
	)
	@test(
		'can normalize schema, schemas to array [schemaId]',
		{
			schema: SchemaFieldTemplateTest.personSchema,
			schemas: [
				SchemaFieldTemplateTest.wrenchSchema,
				SchemaFieldTemplateTest.screwdriverSchema,
			],
		},
		[{ id: 'union-person' }, { id: 'wrench' }, { id: 'screwdriver' }],
		[
			SchemaFieldTemplateTest.personSchema,
			SchemaFieldTemplateTest.wrenchSchema,
			SchemaFieldTemplateTest.screwdriverSchema,
		]
	)
	@test(
		'can normalize schemas, schema to array [schemaId]',
		{
			schemas: [
				SchemaFieldTemplateTest.wrenchSchema,
				SchemaFieldTemplateTest.screwdriverSchema,
			],
			schema: SchemaFieldTemplateTest.personSchema,
		},
		[{ id: 'union-person' }, { id: 'wrench' }, { id: 'screwdriver' }],
		[
			SchemaFieldTemplateTest.personSchema,
			SchemaFieldTemplateTest.wrenchSchema,
			SchemaFieldTemplateTest.screwdriverSchema,
		]
	)
	@test(
		'can normalize schemas, schemaId to array [schemaId]',
		{
			schemas: [
				SchemaFieldTemplateTest.wrenchSchema,
				SchemaFieldTemplateTest.screwdriverSchema,
			],
			schemaId: 'union-person',
		},
		[{ id: 'union-person' }, { id: 'wrench' }, { id: 'screwdriver' }],
		[
			{ id: 'union-person' },
			SchemaFieldTemplateTest.wrenchSchema,
			SchemaFieldTemplateTest.screwdriverSchema,
		]
	)
	protected static async testNormalizingOptionsToId(
		options: ISchemaFieldDefinition['options'],
		toSchemaIdExpected: any,
		toSchemaOrIdExpected?: any
	) {
		const idsWithVersion = SchemaField.mapFieldDefinitionToSchemaIdsWithVersion(
			{
				type: 'schema',
				options,
			}
		)
		assert.isEqualDeep(idsWithVersion, toSchemaIdExpected)

		const schemasOrIdsWithVersion = SchemaField.mapFieldDefinitionToSchemasOrIdsWithVersion(
			{
				type: 'schema',
				options,
			}
		)
		assert.isEqualDeep(
			schemasOrIdsWithVersion,
			toSchemaOrIdExpected ?? toSchemaIdExpected
		)
	}
}
