import '@sprucelabs/path-resolver/register'
import BaseTest, { test, assert } from '@sprucelabs/test'
import Schema from '../../Schema'
import buildSchemaDefinition from '../../utilities/buildSchemaDefinition'
import FieldType from '#spruce:schema/fields/fieldType'

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
		assert.isType<'blue' | 'red' | undefined | null>(favColor)
	}
}
