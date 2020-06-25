import AbstractSpruceTest from '@sprucelabs/test'
import Schema from './Schema'

export default class AbstractSchemaTest extends AbstractSpruceTest {
	protected static async beforeEach() {
		Schema.forgetAllDefinitions()
	}
}
