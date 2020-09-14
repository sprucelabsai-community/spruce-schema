import AbstractSpruceTest from '@sprucelabs/test'
import { SchemaRegistry } from '.'

export default class AbstractSchemaTest extends AbstractSpruceTest {
	protected static registry: SchemaRegistry
	protected static async beforeEach() {
		await super.beforeEach()
		this.registry = SchemaRegistry.getInstance()
		this.registry.forgetAllSchemas()
	}
}
