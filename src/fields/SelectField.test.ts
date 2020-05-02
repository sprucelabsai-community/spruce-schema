import '@sprucelabs/path-resolver/register'
import BaseTest, { test, assert } from '@sprucelabs/test'
import Schema from '../Schema'
import { FieldType } from '#spruce:schema/fields/fieldType'
import {
	SelectOptionsToHash,
	selectOptionsToHash,
	definitionOptionsToHash
} from '../utilities/selectOptionsToHash'
import { personDefinition } from './__mocks__/personWithCars'
import { PickFieldNames } from '../schema.types'
import buildSchemaDefinition from '../utilities/buildSchemaDefinition'

interface IUserDefinition {
	id: 'select-union-test'
	name: 'select union test'
	fields: {
		favoriteColor: {
			type: FieldType.Select
			options: {
				choices: [
					{
						value: 'blue'
						label: 'Blue'
					},
					{
						value: 'red'
						label: 'Red'
					}
				]
			}
		}
	}
}

export default class SelectFieldTest extends BaseTest {
	private static userDefinition = buildSchemaDefinition<IUserDefinition>({
		id: 'select-union-test',
		name: 'select union test',
		fields: {
			favoriteColor: {
				type: FieldType.Select,
				options: {
					choices: [
						{
							value: 'blue',
							label: 'Blue'
						},
						{
							value: 'red',
							label: 'Red'
						}
					]
				}
			}
		}
	})
	@test('Makes select options a union (test passes, lint will fail)')
	protected static async canAccessVarsFromDecorator() {
		const user = new Schema(SelectFieldTest.userDefinition, {
			favoriteColor: 'blue'
		})
		const favColor = user.get('favoriteColor')
		assert.expectType<'blue' | 'red'>(favColor)
	}

	@test('Option hashing')
	protected static async testCreatingOptionHashes() {
		const options = personDefinition.fields.optionalSelect.options.choices

		type Test = SelectOptionsToHash<typeof options>
		const optionsHash = selectOptionsToHash(options)

		assert.expectType<Test>(optionsHash)
		assert.expectType<{ foo: 'Foo'; bar: 'Bar' }>(optionsHash)

		type SelectFields = PickFieldNames<
			typeof personDefinition,
			FieldType.Select
		>

		const optionsHash2 = definitionOptionsToHash(
			personDefinition,
			'optionalSelect'
		)

		const fieldName: SelectFields = 'anotherOptionalSelect'
		const fieldName2: SelectFields = 'optionalSelect'

		assert.expectType<'optionalSelect' | 'anotherOptionalSelect'>(fieldName)
		assert.expectType<'optionalSelect' | 'anotherOptionalSelect'>(fieldName2)

		assert.expectType<{ foo: 'Foo'; bar: 'Bar' }>(optionsHash2)
	}
}
