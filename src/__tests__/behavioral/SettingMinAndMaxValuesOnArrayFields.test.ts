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

const zeroMinTwoRequiredFields = buildSchema({
	id: 'zeroMinTwoRequiredFields',
	fields: {
		name: {
			type: 'text',
			isRequired: true,
		},
		favoriteColors: {
			type: 'text',
			isArray: true,
			isRequired: true,
			minArrayLength: 0,
		},
	},
})

export default class SettingMinAndMaxValuesOnArrayFieldsTest extends AbstractSchemaTest {
	@test()
	protected static defaultsToOneValueRequired() {
		const err = assert.doesThrow(() =>
			validateSchemaValues(noMinOrMaxSchema, { favoriteColors: [] })
		)

		errorAssertUtil.assertError(err, 'VALIDATION_FAILED')
	}

	@test.only()
	protected static failsWhenMissing() {
		const err = assert.doesThrow(() =>
			validateSchemaValues(zeroMinTwoRequiredFields, {})
		)

		errorAssertUtil.assertError(err, 'VALIDATION_FAILED', {
			'errors[0].options.parameters': ['name', 'favoriteColors'],
		})
	}

	@test()
	protected static defaultOneValueRequiredPassesWithOneValue() {
		validateSchemaValues(noMinOrMaxSchema, { favoriteColors: ['pink'] })
	}

	@test()
	protected static minArrayLengthZero() {
		validateSchemaValues(zeroMinValuesSchema, { favoriteColors: [] })
	}

	@test()
	protected static minArrayLength2ThrowsWithLessThan() {
		const err = assert.doesThrow(() =>
			validateSchemaValues(twoMinValuesSchema, { favoriteColors: ['purple'] })
		)

		errorAssertUtil.assertError(err, 'VALIDATION_FAILED')
	}

	@test()
	protected static passesWithMoreThanMin() {
		validateSchemaValues(twoMinValuesSchema, {
			favoriteColors: ['pink', 'purple'],
		})
	}
}
