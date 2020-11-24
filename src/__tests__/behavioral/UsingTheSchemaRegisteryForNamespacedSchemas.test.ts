import { test, assert } from '@sprucelabs/test'
import { buildSchema, SchemaRegistry } from '../..'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import { Schema } from '../../schemas.static.types'

const namespacedUnVersionedPersonSchema = buildSchema({
	id: 'namespacedUnVersionedPerson',
	namespace: 'namespace-one',
	fields: {
		firstName: {
			type: 'text',
		},
	},
})

const namespaced2UnVersionedPersonSchema = buildSchema({
	id: 'namespacedUnVersionedPerson',
	namespace: 'namespace-two',
	fields: {
		firstName: {
			type: 'text',
		},
	},
})

const namespacedVersionedPersonSchema = buildSchema({
	id: 'namespacedUnVersionedPerson',
	namespace: 'namespace-one',
	version: 'v1',
	fields: {
		firstName: {
			type: 'text',
		},
	},
})

const namespaced2VersionedPersonSchema = buildSchema({
	id: 'namespacedUnVersionedPerson',
	namespace: 'namespace-one',
	version: 'v2',
	fields: {
		firstName: {
			type: 'text',
		},
	},
})

export default class UsingTheSchemaRegisteryForNamespacedSchemasTest extends AbstractSchemaTest {
	protected static registry: SchemaRegistry

	protected static async beforeEach() {
		await super.beforeEach()
		this.registry = new SchemaRegistry()
	}

	@test()
	protected static throwsErrorIncludingNamespaceWhenNonFound() {
		assert.doesThrow(
			() => this.registry.getSchema('made-up-id', '1.0', 'spruce'),
			/spruce.made-up-id\(version: 1.0\)/gi
		)
		assert.doesThrow(
			() => this.registry.getSchema('made-up-id', '1.0', 'spruce'),
			/1\.0/gi
		)
		assert.doesThrow(
			() => this.registry.getSchema('made-up-id', undefined, 'spruce'),
			/spruce/gi
		)
	}

	@test(
		'Register 1 schema, 1 namespace',
		[namespacedUnVersionedPersonSchema],
		[
			{
				id: 'namespacedUnVersionedPerson',
				namespace: 'namespace-one',
				shouldMatchSchemaAtIdx: 0,
			},
		]
	)
	@test(
		'Register 2 schemas with same id, 2 namespaces',
		[namespacedUnVersionedPersonSchema, namespaced2UnVersionedPersonSchema],
		[
			{
				id: 'namespacedUnVersionedPerson',
				namespace: 'namespace-two',
				shouldMatchSchemaAtIdx: 1,
			},
			{
				id: 'namespacedUnVersionedPerson',
				namespace: 'namespace-one',
				shouldMatchSchemaAtIdx: 0,
			},
		]
	)
	@test(
		'Register 2 schemas with same id, 2 versions, 1 namespaces',
		[namespacedVersionedPersonSchema, namespaced2VersionedPersonSchema],
		[
			{
				id: 'namespacedUnVersionedPerson',
				version: 'v1',
				shouldMatchSchemaAtIdx: 0,
			},
			{
				id: 'namespacedUnVersionedPerson',
				version: 'v2',
				shouldMatchSchemaAtIdx: 1,
			},
		]
	)
	@test(
		'Register 3 schemas with same id, 2 versions, 2 namespaces',
		[
			namespacedVersionedPersonSchema,
			namespaced2VersionedPersonSchema,
			namespaced2UnVersionedPersonSchema,
		],
		[
			{
				id: 'namespacedUnVersionedPerson',
				version: 'v1',
				shouldMatchSchemaAtIdx: 0,
			},
			{
				id: 'namespacedUnVersionedPerson',
				version: 'v2',
				shouldMatchSchemaAtIdx: 1,
			},
			{
				id: 'namespacedUnVersionedPerson',
				namespace: 'namespace-two',
				shouldMatchSchemaAtIdx: 2,
			},
		]
	)
	protected static canRegisterNamespacedSchema(
		schemas: Schema[],
		lookups: {
			id: string
			version?: string
			namespace?: string
			shouldMatchSchemaAtIdx: number
		}[]
	) {
		for (const schema of schemas) {
			this.registry.trackSchema(schema)
		}

		for (const lookup of lookups) {
			const gotPerson = this.registry.getSchema(
				lookup.id,
				lookup.version,
				lookup.namespace
			)

			assert.isTruthy(gotPerson)
			//@ts-ignore
			assert.isEqualDeep(schemas[lookup.shouldMatchSchemaAtIdx], gotPerson)
		}
	}
}
