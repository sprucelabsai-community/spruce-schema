import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import { FieldFactory } from '../..'
import StaticSchemaEntityImpl from '../../StaticSchemaEntityImpl'
import buildSchema from '../../utilities/buildSchema'

interface UserSchema {
	id: 'select-union-test'
	name: 'select union test'
	fields: {
		favoriteColor: {
			type: 'select'
			options: {
				choices: [
					{
						value: 'blue'
						label: 'Blue'
					},
					{
						value: 'red'
						label: 'Red'
					},
				]
			}
		}
		favoriteColorRequired: {
			type: 'select'
			isRequired: true
			options: {
				choices: [
					{
						value: 'blue'
						label: 'Blue'
					},
					{
						value: 'red'
						label: 'Red'
					},
				]
			}
		}
	}
}

export default class SelectFieldTest extends AbstractSpruceTest {
	private static userSchema = buildSchema<UserSchema>({
		id: 'select-union-test',
		name: 'select union test',
		fields: {
			favoriteColor: {
				type: 'select',
				options: {
					choices: [
						{
							value: 'blue',
							label: 'Blue',
						},
						{
							value: 'red',
							label: 'Red',
						},
					],
				},
			},
			favoriteColorRequired: {
				type: 'select',
				isRequired: true,
				options: {
					choices: [
						{
							value: 'blue',
							label: 'Blue',
						},
						{
							value: 'red',
							label: 'Red',
						},
					],
				},
			},
		},
	})
	@test('Makes select options a union (test passes, lint will fail)')
	protected static async canMakeSelectOptionsUnion() {
		const user = new StaticSchemaEntityImpl(this.userSchema, {
			favoriteColor: 'blue',
			favoriteColorRequired: 'blue',
		})
		const favColor = user.get('favoriteColor')
		const favoriteColorRequired = user.get('favoriteColorRequired')

		assert.isType<'blue' | 'red' | undefined | null>(favColor)
		assert.isType<'blue' | 'red'>(favoriteColorRequired)
	}

	@test()
	protected static catchesBadChoice() {
		const field = FieldFactory.Field('test', {
			type: 'select',
			options: {
				choices: [
					{ label: 'good', value: 'good' },
					{ label: 'bad', value: 'bad' },
					{ label: 'ugly', value: 'ugly' },
				],
			},
		})

		const results = field.validate('cheese')
		assert.isLength(results, 1)
		assert.isEqual(results[0].code, 'INVALID_PARAMETER')
	}

	@test()
	protected static validationHandlesUndefinedForOptional() {
		const field = FieldFactory.Field('test', {
			type: 'select',
			options: {
				choices: [
					{ label: 'good', value: 'good' },
					{ label: 'bad', value: 'bad' },
					{ label: 'ugly', value: 'ugly' },
				],
			},
		})

		const results = field.validate(undefined)
		assert.isLength(results, 0)
	}

	@test()
	protected static validationHandlesRequired() {
		const field = FieldFactory.Field('test', {
			type: 'select',
			isRequired: true,
			options: {
				choices: [
					{ label: 'good', value: 'good' },
					{ label: 'bad', value: 'bad' },
					{ label: 'ugly', value: 'ugly' },
				],
			},
		})

		const results = field.validate(undefined)

		assert.isLength(results, 1)
		assert.isEqual(results[0].code, 'MISSING_PARAMETER')
	}
}
