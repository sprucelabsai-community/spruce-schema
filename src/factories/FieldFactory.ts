import fieldClassMap from '#spruce/schemas/fields/fieldClassMap'
import { FieldDefinition, IFieldMap } from '#spruce/schemas/fields/fields.types'

// let firstRun = true

export default class FieldFactory {
	/** Factory for creating a new field from a definition */
	public static field<F extends FieldDefinition>(
		name: string,
		definition: F
	): IFieldMap[F['type']] {
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
