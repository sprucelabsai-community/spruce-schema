import '@sprucelabs/path-resolver/register'
import BaseTest, { test, assert } from '@sprucelabs/test'
import Schema, { buildSchemaDefinition } from '..'
import { FieldType } from './fieldType'

type SelectUnion = 'blue' | 'red'

export default class SelectFieldTest extends BaseTest {
	@test('Makes select options a union (test passes, lint will fail)')
	protected static async canAccessVarsFromDecorator() {
		const userDefinition = buildSchemaDefinition({
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

		const user = new Schema(userDefinition, { favoriteColor: 'blue' })
		// @ts-ignore // TODO better typing
		const favColor: SelectUnion = user.get('favoriteColor')
		assert.isOk(favColor)
	}
}
