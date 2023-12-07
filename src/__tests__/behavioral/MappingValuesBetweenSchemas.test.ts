import { test, assert } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import KeyMapper from '../../utilities/KeyMapper'

export default class MappingValuesBetweenSchemasTest extends AbstractSchemaTest {
	private static mapper: KeyMapper

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

		this.assertMapsBothWays(
			{
				hey: 'there',
				foo: 'bar',
			},
			{
				hey: 'to',
				foo: 'barbar',
			},
			{
				to: 'there',
				barbar: 'bar',
			}
		)
	}

	@test()
	protected static async canMapFieldName() {
		this.mapper = this.Mapper({
			hey: 'to',
			what: 'is',
		})

		this.assertMapsFieldNameTo('hey', 'to')
		this.assertMapsFieldNameTo('what', 'is')
	}

	private static assertMapsFieldNameTo(from: string, to: string) {
		const actual = this.mapper.mapFieldNameTo(from)
		assert.isEqual(actual, to)
		const reverse = this.mapper.mapFieldNameFrom(to)
		assert.isEqual(reverse, from)
	}

	private static assertMapsBothWays(
		values: Record<string, any>,
		map: Record<string, any>,
		expectedToResults: Record<string, any>,
		expectedFromResults?: Record<string, any>
	) {
		this.mapper = this.Mapper(map)
		const results = this.mapper.mapTo(values)
		assert.isEqualDeep(results, expectedToResults)

		const results2 = this.mapper.mapFrom(results)
		assert.isEqualDeep(results2, expectedFromResults ?? values)
	}

	private static Mapper(map: Record<string, any>) {
		return new KeyMapper(map)
	}
}
