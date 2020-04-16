import '@sprucelabs/path-resolver/register'
import BaseTest, { test } from '@sprucelabs/test'
import { ExecutionContext } from 'ava'
import Schema, { buildSchemaDefinition } from '..'
import { FieldType } from './fieldType'
import { buildSelectChoices } from './SelectField'

/** Context just for this test */
interface IContext {}

export default class SelectFieldTest extends BaseTest {
	@test('Makes select options a union (test passes, lint will fail)')
	protected static async canAccessVarsFromDecorator(
		t: ExecutionContext<IContext>
	) {
		const userDefinition = buildSchemaDefinition({
			id: 'select-union-test',
			name: 'select union test',
			fields: {
				favoriteColor: {
					type: FieldType.Select,
					options: {
						choices: buildSelectChoices([
							{
								value: 'blue',
								label: 'Blue'
							},
							{
								value: 'red',
								label: 'Red'
							}
						])
					}
				}
			}
		})

		const user = new Schema(userDefinition, { favoriteColor: 'blue' })
		const favColor = user.get('favoriteColor')
		t.assert(favColor)
	}
}
