import AbstractSpruceTest, { assert, test } from '@sprucelabs/test'
import SchemaRegistry from '../../singletons/SchemaRegistry'
import buildPersonWithCars from '../data/personWithCars'
import buildVersionedPersonWithCars from '../data/versionedPersonWithCars'

export default class UsingTheSchemaRegistryTest extends AbstractSpruceTest {
	protected static registry: SchemaRegistry

	protected static async beforeEach() {
		await super.beforeEach()
		this.registry = new SchemaRegistry()
	}

	@test()
	protected static canAccessRegistryInstance() {
		assert.isTruthy(this.registry)
	}

	@test()
	protected static canRegisterUnVersionedSchema() {
		const { personSchema } = buildPersonWithCars()
		this.registry.trackSchema(personSchema)

		const gotPerson = this.registry.getSchema(personSchema.id)

		assert.isEqualDeep(gotPerson, personSchema)
	}

	@test()
	protected static canRegisterVersionAndUnVersionedSchema() {
		const { personSchema } = buildPersonWithCars()
		const { personV1Schema, personV2Schema } = buildVersionedPersonWithCars()

		this.registry.trackSchema(personSchema)
		this.registry.trackSchema(personV1Schema)
		this.registry.trackSchema(personV2Schema)

		assert.isEqualDeep(this.registry.getSchema(personSchema.id), personSchema)
		assert.isEqualDeep(
			this.registry.getSchema(personV1Schema.id, personV1Schema.version),
			personV1Schema
		)
		assert.isEqualDeep(
			this.registry.getSchema(personV2Schema.id, personV2Schema.version),
			personV2Schema
		)
	}

	@test()
	protected static schemasCanBeForgotten() {
		const { personSchema } = buildPersonWithCars()
		this.registry.trackSchema(personSchema)

		this.registry.forgetSchema(personSchema.id)
		assert.doesThrow(
			() => this.registry.getSchema(personSchema.id),
			/Could not find schema "person"/
		)
	}

	private static buildPersonsAllVersions() {
		const { personSchema } = buildPersonWithCars()
		const { personV1Schema, personV2Schema } = buildVersionedPersonWithCars()
		this.registry.trackSchema(personSchema)
		this.registry.trackSchema(personV1Schema)
		this.registry.trackSchema(personV2Schema)

		return { personSchema, personV1Schema, personV2Schema }
	}

	@test()
	protected static versionedSchemasAreForgotten() {
		const {
			personSchema,
			personV1Schema,
			personV2Schema,
		} = this.buildPersonsAllVersions()
		this.registry.forgetSchema(personSchema.id)
		assert.doesThrow(
			() => this.registry.getSchema(personSchema.id),
			/VERSION_NOT_FOUND/
		)

		assert.isEqualDeep(
			this.registry.getSchema(personV1Schema.id, personV1Schema.version),
			personV1Schema
		)

		assert.isEqualDeep(
			this.registry.getSchema(personV2Schema.id, personV2Schema.version),
			personV2Schema
		)

		this.registry.forgetSchema(personV2Schema.id, personV2Schema.version)
		assert.doesThrow(
			() => this.registry.getSchema(personV2Schema.id, personV2Schema.version),
			/VERSION_NOT_FOUND/
		)
	}

	@test()
	protected static canForgetAllSchemas() {
		const {
			personSchema,
			personV1Schema,
			personV2Schema,
		} = this.buildPersonsAllVersions()

		this.registry.forgetAllSchemas()

		for (const schema of [personSchema, personV1Schema, personV2Schema]) {
			assert.doesThrow(
				() => this.registry.getSchema(schema.id, schema.version),
				/Could not find schema "person"/
			)
		}
	}
}
