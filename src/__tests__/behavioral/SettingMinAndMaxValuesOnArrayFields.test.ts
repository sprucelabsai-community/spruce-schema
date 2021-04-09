import { test, assert } from '@sprucelabs/test'
import { errorAssertUtil } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import buildSchema from '../../utilities/buildSchema'
import validateSchemaValues from '../../utilities/validateSchemaValues'

const noMinOrMaxSchema = buildSchema({
	id: 'noMinOrMax',
	fields: {
		favoriteColors: {
			type: 'text',
			isArray: true,
			isRequired: true,
		},
	},
})

const zeroMinValuesSchema = buildSchema({
	id: 'zeroMinValues',
	fields: {
		favoriteColors: {
			type: 'text',
			isArray: true,
			isRequired: true,
			minArrayLength: 0,
		},
	},
})

const twoMinValuesSchema = buildSchema({
	id: 'twoMinValues',
	fields: {
		favoriteColors: {
			type: 'text',
			isArray: true,
			isRequired: true,
			minArrayLength: 2,
		},
	},
})

export default class SettingMinAndMaxValuesOnArrayFieldsTest extends AbstractSchemaTest {
	@test()
	protected static async defaultsToOneValueRequired() {
		const err = assert.doesThrow(() =>
			validateSchemaValues(noMinOrMaxSchema, { favoriteColors: [] })
		)

		errorAssertUtil.assertError(err, 'VALIDATION_FAILED')
	}

	@test()
	protected static async defaultOneValueRequiredPassesWithOneValue() {
		validateSchemaValues(noMinOrMaxSchema, { favoriteColors: ['pink'] })
	}

	@test()
	protected static async minArrayLengthZero() {
		validateSchemaValues(zeroMinValuesSchema, { favoriteColors: [] })
	}

	@test()
	protected static async minArrayLength2ThrowsWithLessThan() {
		const err = assert.doesThrow(() =>
			validateSchemaValues(twoMinValuesSchema, { favoriteColors: ['purple'] })
		)

		errorAssertUtil.assertError(err, 'VALIDATION_FAILED')
	}

	@test()
	protected static async passesWithMoreThanMin() {
		validateSchemaValues(twoMinValuesSchema, {
			favoriteColors: ['pink', 'purple'],
		})
	}
}
