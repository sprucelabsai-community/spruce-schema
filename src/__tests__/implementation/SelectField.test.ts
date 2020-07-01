import '@sprucelabs/path-resolver/register'
import BaseTest, { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import Schema from '../../Schema'
import buildSchemaDefinition from '../../utilities/buildSchemaDefinition'

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
		favoriteColorRequired: {
			type: FieldType.Select
			options: {
				isRequired: true
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
			},
			favoriteColorRequired: {
				type: FieldType.Select,
				options: {
					isRequired: true,
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
	protected static async canMakeSelectOptionsUnion() {
		const user = new Schema(this.userDefinition, {
			favoriteColor: 'blue'
		})
		const favColor = user.get('favoriteColor')
		// TODO why are we not getting this?
		// const favoriteColorRequired = user.get('favoriteColorRequired')

		assert.isType<'blue' | 'red' | undefined | null>(favColor)
		// assert.isType<'blue' | 'red'>(favoriteColorRequired)
	}
}
