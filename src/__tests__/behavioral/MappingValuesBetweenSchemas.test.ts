import { test, assert } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import KeyMapper from '../../utilities/KeyMapper'

export default class MappingValuesBetweenSchemasTest extends AbstractSchemaTest {
	@test()
	protected static async mapsToNothingIfNoFieldsMatch() {
		this.assertMapsBothWays(
			{
				hello: 'world',
			},
			{
				from: 'to',
			},
			{},
			{}
		)
	}

	@test()
	protected static async canMapToSingleField() {
		this.assertMapsBothWays(
			{
				hello: 'world',
			},
			{
				hello: 'to',
			},
			{
				to: 'world',
			}
		)
	}

	@test()
	protected static async canMapToMultipleFields() {
		this.assertMapsBothWays(
			{
				hello: 'world',
				foo: 'bar',
			},
			{
				hello: 'to',
				foo: 'barbar',
			},
			{
				to: 'world',
				barbar: 'bar',
			}
		)
	}

	private static assertMapsBothWays(
		values: Record<string, any>,
		map: Record<string, any>,
		expectedToResults: Record<string, any>,
		expectedFromResults?: Record<string, any>
	) {
		const keyMapper = new KeyMapper(map)
		const results = keyMapper.mapTo(values)
		assert.isEqualDeep(results, expectedToResults)

		const results2 = keyMapper.mapFrom(results)
		assert.isEqualDeep(results2, expectedFromResults ?? values)
	}
}
