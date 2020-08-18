import { FieldDefinition, IFieldMap } from '#spruce/schemas/fields/fields.types'
import log from '../singletons/log'

export default class FieldFactory {
	public static field<F extends FieldDefinition>(
		name: string,
		definition: F
	): IFieldMap[F['type']] {
		log.warn(
			'Calling deprecated FieldFactory.field. Use the capital letter version of the factory function. FieldFactory.Field()'
		)
		return this.Field(name, definition)
	}

	/** Factory for creating a new field from a definition */
	public static Field<F extends FieldDefinition>(
		name: string,
		definition: F
	): IFieldMap[F['type']] {
		const fieldClassMap = require('#spruce/schemas/fields/fieldClassMap')
			.default
		const fieldClass = fieldClassMap[definition.type]

		if (!fieldClass) {
			throw new Error(
				`Failed to find schema field by type "${definition.type}" for field named ${name}.`
			)
		}

		// @ts-ignore
		const field = new fieldClass(name, definition)
		return field
	}
}
