import { test } from '@sprucelabs/test'
import '../data/personWithCars'
import { assert } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import SchemaEntity from '../../SchemaEntity'
import buildPersonWithCars from '../data/personWithCars'

export default class CanGetSchemasTest extends AbstractSchemaTest {
	protected static async beforeEach() {
		await super.beforeEach()
		buildPersonWithCars()
	}

	@test()
	protected static canGetDefinitionsByIdBasedOnImportedFile() {
		const personSchema = SchemaEntity.getSchema('person')
		const carSchema = SchemaEntity.getSchema('car')

		assert.isOk(personSchema)
		assert.isOk(carSchema)
	}

	@test()
	protected static throwsIfCantMatchId() {
		assert.doesThrow(
			() => SchemaEntity.getSchema('pizzaPi'),
			/SCHEMA_NOT_FOUND/gi
		)
	}
}
