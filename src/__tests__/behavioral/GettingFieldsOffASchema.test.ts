import { test, assert } from '@sprucelabs/test'
import { errorAssertUtil } from '@sprucelabs/test-utils'
import { buildSchema } from '../..'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import getFields from '../../utilities/getFields'

const noFieldsSchema = buildSchema({
	id: 'noField',
	fields: {},
})

const withFieldsSchema = buildSchema({
	id: 'withField',
	fields: {
		firstName: {
			type: 'text',
		},
	},
})

const withManyFieldsSchema = buildSchema({
	id: 'withManyField',
	fields: {
		firstName: {
			type: 'text',
		},
		lastName: {
			type: 'text',
		},
	},
})

export default class GettingFieldsOffASchemaTest extends AbstractSchemaTest {
	@test()
	protected static async throwsWithNothingPassed() {
		//@ts-ignore
		const err = assert.doesThrow(() => getFields())
		errorAssertUtil.assertError(err, 'INVALID_PARAMETERS', {
			parameters: ['schema'],
		})
	}

	@test()
	protected static async noFieldsThrows() {
		const err = assert.doesThrow(() => getFields(noFieldsSchema))
		errorAssertUtil.assertError(err, 'INVALID_PARAMETERS', {
			parameters: ['schema'],
		})
	}

	@test()
	protected static async getsBacksFields() {
		const actual = getFields(withFieldsSchema)
		assert.isEqualDeep(actual, ['firstName'])
		assert.isExactType<typeof actual, 'firstName'[]>(true)
	}

	@test()
	protected static async getsBackMoreFields() {
		const actual = getFields(withManyFieldsSchema)
		assert.isEqualDeep(actual, ['firstName', 'lastName'])
		assert.isExactType<typeof actual, ('firstName' | 'lastName')[]>(true)
	}
}
