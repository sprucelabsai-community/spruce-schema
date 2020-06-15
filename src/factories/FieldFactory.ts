import { FieldDefinition, IFieldMap } from '#spruce:schema/fields/fields.types'
import { FieldClassMap } from '#spruce:schema/fields/fieldClassMap'
// let firstRun = true

export default class FieldFactory {
	/** Factory for creating a new field from a definition */
	public static field<F extends FieldDefinition>(
		name: string,
		definition: F,
		fieldClassMap: typeof FieldClassMap = FieldClassMap
	): IFieldMap[F['type']] {
		// this will pull in augmentations to the field class map object, only needed first load
		// if (firstRun) {
		// 	// @ts-ignore
		// 	require('#spruce:schema/fields/fieldClassMap')
		// 	firstRun = false
		// }

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
