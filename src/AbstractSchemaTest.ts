import AbstractSpruceTest from '@sprucelabs/test'
import SchemaEntity from './SchemaEntity'

export default class AbstractSchemaTest extends AbstractSpruceTest {
	protected static async beforeEach() {
		SchemaEntity.forgetAllSchemas()
	}
}
