import { test, assert } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import DynamicSchemaEntityImplementation from '../../DynamicSchemaEntityImplementation'
import EntityFactory from '../../factories/EntityFactory'
import StaticSchemaEntityImplementation from '../../StaticSchemaEntityImplementation'

export default class CreatingEntityInstancesTest extends AbstractSchemaTest {
	@test()
	protected static async canCreateStaticEntity() {
		const instance = EntityFactory.Entity({
			id: 'staticPerson',
			fields: {
				firstName: {
					type: 'text',
					isRequired: true,
				},
			},
		})

		assert.isTrue(instance instanceof StaticSchemaEntityImplementation)
	}

	@test()
	protected static async typesStaticEntity() {
		const instance = EntityFactory.Entity(
			{
				id: 'staticPerson',
				fields: {
					firstName: {
						type: 'text',
						isRequired: true,
					},
				},
			},
			{
				firstName: 'Tay tay',
			}
		)

		const values = instance.getValues()

		assert.isExactType<typeof values, { firstName: string }>(true)
	}

	@test()
	protected static async canCreateDynamicEntity() {
		const instance = EntityFactory.Entity({
			id: 'staticPerson',
			dynamicFieldSignature: {
				type: 'boolean',
				keyName: 'key',
			},
		})

		assert.isTrue(instance instanceof DynamicSchemaEntityImplementation)
	}

	@test()
	protected static async typesDynamicEntity() {
		const instance = EntityFactory.Entity(
			{
				id: 'staticPerson',
				dynamicFieldSignature: {
					type: 'boolean',
					keyName: 'key',
				},
			},
			{
				pass: true,
				youSure: false,
			}
		)

		const values = instance.getValues()

		assert.isExactType<
			typeof values,
			{ [key: string]: boolean | undefined | null }
		>(true)
	}
}
