import AbstractSpruceTest, { assert, test } from '@sprucelabs/test-utils'
import SchemaRegistry from '../../singletons/SchemaRegistry'
import buildPersonWithCars from '../data/personWithCars'
import buildVersionedPersonWithCars from '../data/versionedPersonWithCars'

export default class UsingTheSchemaRegistryTest extends AbstractSpruceTest {
    protected static registry: SchemaRegistry

    protected static async beforeEach() {
        await super.beforeEach()
        SchemaRegistry.getInstance().forgetAllSchemas()
        this.registry = new SchemaRegistry()
        delete process.env.SHOULD_USE_SCHEMA_REGISTRY
    }

    @test()
    protected static canAccessRegistryInstance() {
        assert.isTruthy(this.registry)
    }

    @test()
    protected static throwsWhenTrackingTwice() {
        const { personSchema } = buildPersonWithCars()
        const { personV1Schema } = buildVersionedPersonWithCars()
        this.registry.trackSchema(personSchema)
        this.registry.trackSchema(personV1Schema)
        assert.doesThrow(
            () => this.registry.trackSchema(personSchema),
            /person/i
        )
        assert.doesThrow(
            () => this.registry.trackSchema(personV1Schema),
            /person\(version: v1\)/
        )
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
        const { personV1Schema, personV2Schema } =
            buildVersionedPersonWithCars()

        this.registry.trackSchema(personSchema)
        this.registry.trackSchema(personV1Schema)
        this.registry.trackSchema(personV2Schema)

        assert.isEqualDeep(
            this.registry.getSchema(personSchema.id),
            personSchema
        )
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
            /'person'/
        )
    }

    private static buildPersonsAllVersions() {
        const { personSchema } = buildPersonWithCars()
        const { personV1Schema, personV2Schema } =
            buildVersionedPersonWithCars()

        this.registry.trackSchema(personSchema)
        this.registry.trackSchema(personV1Schema)
        this.registry.trackSchema(personV2Schema)

        return { personSchema, personV1Schema, personV2Schema }
    }

    @test()
    protected static versionedSchemasAreForgotten() {
        const { personSchema, personV1Schema, personV2Schema } =
            this.buildPersonsAllVersions()
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
            () =>
                this.registry.getSchema(
                    personV2Schema.id,
                    personV2Schema.version
                ),
            /VERSION_NOT_FOUND/
        )
    }

    @test()
    protected static canForgetAllSchemas() {
        const { personSchema, personV1Schema, personV2Schema } =
            this.buildPersonsAllVersions()

        this.registry.forgetAllSchemas()

        for (const schema of [personSchema, personV1Schema, personV2Schema]) {
            assert.doesThrow(
                () => this.registry.getSchema(schema.id, schema.version),
                'person'
            )
        }
    }

    @test()
    protected static canGetAllSchemas() {
        const { personSchema, personV1Schema, personV2Schema } =
            this.buildPersonsAllVersions()

        const pulled = this.registry.getAllSchemas()

        assert.isEqualDeep(pulled, [
            personSchema,
            personV1Schema,
            personV2Schema,
        ])
    }

    @test()
    protected static shouldNotTrackedBasedOnEnv() {
        SchemaRegistry.reset()
        process.env.SHOULD_USE_SCHEMA_REGISTRY = 'false'
        buildPersonWithCars()
        buildPersonWithCars()
        SchemaRegistry.reset()
        process.env.SHOULD_USE_SCHEMA_REGISTRY = 'true'
        buildPersonWithCars()
        assert.doesThrow(() => buildPersonWithCars())
    }
}
