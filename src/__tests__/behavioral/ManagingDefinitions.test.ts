import { test } from '@sprucelabs/test'
import '../data/personWithCars'
import { assert } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import Schema from '../../Schema'
import buildPersonWithCars from '../data/personWithCars'

export default class CanGetSchemasTest extends AbstractSchemaTest {
	protected static async beforeEach() {
		await super.beforeEach()
		buildPersonWithCars()
	}

	@test()
	protected static canGetDefinitionsByIdBasedOnImportedFile() {
		const personDefinition = Schema.getDefinition('person')
		const carDefinition = Schema.getDefinition('car')

		assert.isOk(personDefinition)
		assert.isOk(carDefinition)
	}

	@test()
	protected static throwsIfCantMatchId() {
		assert.doesThrow(
			() => Schema.getDefinition('pizzaPi'),
			/SCHEMA_NOT_FOUND/gi
		)
	}
}
