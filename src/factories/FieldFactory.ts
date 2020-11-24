import { FieldDefinitions, IFieldMap, fieldClassMap } from '../fields'

export default class FieldFactory {
	/** Factory for creating a new field from a definition */
	public static Field<F extends FieldDefinitions>(
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
