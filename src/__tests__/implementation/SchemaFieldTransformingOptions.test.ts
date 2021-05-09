import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import SchemaField from '../../fields/SchemaField'
import { SchemaFieldFieldDefinition } from '../../fields/SchemaField.types'
import buildSchema from '../../utilities/buildSchema'

const wrenchSchema = buildSchema({
	id: 'wrench',
	name: 'Wrench',
	fields: {
		wrenchSize: {
			type: 'number',
			label: 'Size',
		},
	},
})

const versionedWrench = buildSchema({
	id: 'wrench',
	name: 'Wrench',
	version: '1.0',
	fields: {
		wrenchSize: {
			type: 'number',
			label: 'Size',
		},
	},
})

const namespacedWrench = buildSchema({
	id: 'wrench',
	name: 'Wrench',
	namespace: 'one',
	fields: {
		wrenchSize: {
			type: 'number',
			label: 'Size',
		},
	},
})

const namespacedVersionedWrench = buildSchema({
	id: 'wrench',
	name: 'Wrench',
	version: '1.0',
	namespace: 'one',
	fields: {
		wrenchSize: {
			type: 'number',
			label: 'Size',
		},
	},
})

const namespaced2VersionedWrench = buildSchema({
	id: 'wrench',
	name: 'Wrench',
	version: '1.0',
	namespace: 'two',
	fields: {
		wrenchSize: {
			type: 'number',
			label: 'Size',
		},
	},
})

const screwdriverSchema = buildSchema({
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

const personSchema = buildSchema({
	id: 'union-person',
	name: 'Union Person',
	fields: {
		favoriteTool: {
			type: 'schema',
			options: {
				schemas: [wrenchSchema, screwdriverSchema],
			},
		},
		tools: {
			type: 'schema',
			isArray: true,
			options: {
				schemas: [wrenchSchema, screwdriverSchema],
			},
		},
	},
})

export default class SchemaFieldTemplateTest extends AbstractSpruceTest {
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
		{ schema: wrenchSchema },
		[{ id: 'wrench' }],
		[wrenchSchema]
	)
	@test(
		'can normalize schemas to array [schemaId]',
		{
			schemas: [wrenchSchema, screwdriverSchema],
		},
		[{ id: 'wrench' }, { id: 'screwdriver' }],
		[wrenchSchema, screwdriverSchema]
	)
	@test(
		'can normalize schema, schemas to array [schemaId]',
		{
			schema: personSchema,
			schemas: [wrenchSchema, screwdriverSchema],
		},
		[{ id: 'union-person' }, { id: 'wrench' }, { id: 'screwdriver' }],
		[personSchema, wrenchSchema, screwdriverSchema]
	)
	@test(
		'can normalize schemas, schema to array [schemaId]',
		{
			schemas: [wrenchSchema, screwdriverSchema],
			schema: personSchema,
		},
		[{ id: 'union-person' }, { id: 'wrench' }, { id: 'screwdriver' }],
		[personSchema, wrenchSchema, screwdriverSchema]
	)
	@test(
		'can normalize schemas, schemaId to array [schemaId]',
		{
			schemas: [wrenchSchema, screwdriverSchema],
			schemaId: 'union-person',
		},
		[{ id: 'union-person' }, { id: 'wrench' }, { id: 'screwdriver' }],
		[{ id: 'union-person' }, wrenchSchema, screwdriverSchema]
	)
	@test(
		'can handle versioned and un-versioned',
		{
			schemas: [
				{
					id: versionedWrench.id,
					version: versionedWrench.version,
				},
				wrenchSchema,
			],
		},
		[
			{ id: versionedWrench.id, version: versionedWrench.version },
			{ id: wrenchSchema.id },
		],
		[{ id: versionedWrench.id, version: versionedWrench.version }, wrenchSchema]
	)
	@test(
		'can handle same namespace with different versions',
		{
			schemas: [
				{
					id: namespacedVersionedWrench.id,
					version: namespacedVersionedWrench.version,
					namespace: namespacedVersionedWrench.namespace,
				},
				namespacedWrench,
			],
		},
		[
			{
				id: namespacedVersionedWrench.id,
				version: namespacedVersionedWrench.version,
				namespace: namespacedVersionedWrench.namespace,
			},
			{ id: namespacedWrench.id, namespace: namespacedWrench.namespace },
		],
		[
			{
				id: namespacedVersionedWrench.id,
				version: namespacedVersionedWrench.version,
				namespace: namespacedVersionedWrench.namespace,
			},
			namespacedWrench,
		]
	)
	@test(
		'can handle different namespace with same versions and and id',
		{
			schemas: [
				{
					id: namespacedVersionedWrench.id,
					version: namespacedVersionedWrench.version,
					namespace: namespacedVersionedWrench.namespace,
				},
				namespaced2VersionedWrench,
			],
		},
		[
			{
				id: namespacedVersionedWrench.id,
				version: namespacedVersionedWrench.version,
				namespace: namespacedVersionedWrench.namespace,
			},
			{
				id: namespaced2VersionedWrench.id,
				version: namespaced2VersionedWrench.version,
				namespace: namespaced2VersionedWrench.namespace,
			},
		],
		[
			{
				id: namespacedVersionedWrench.id,
				version: namespacedVersionedWrench.version,
				namespace: namespacedVersionedWrench.namespace,
			},
			namespaced2VersionedWrench,
		]
	)
	protected static async testNormalizingOptionsToId(
		options: SchemaFieldFieldDefinition['options'],
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

		const schemasOrIdsWithVersion =
			SchemaField.mapFieldDefinitionToSchemasOrIdsWithVersion({
				type: 'schema',
				options,
			})
		assert.isEqualDeep(
			schemasOrIdsWithVersion,
			toSchemaOrIdExpected ?? toSchemaIdExpected
		)
	}
}
