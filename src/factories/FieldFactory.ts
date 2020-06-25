import { FieldDefinition, IFieldMap } from '#spruce:schema/fields/fields.types'
// let firstRun = true
let FieldClassMap: Record<string, any>

export default class FieldFactory {
	/** Factory for creating a new field from a definition */
	public static field<F extends FieldDefinition>(
		name: string,
		definition: F
	): IFieldMap[F['type']] {
		// this will pull in augmentations to the field class map object, only needed first load
		// if (firstRun) {
		// 	// @ts-ignore
		// 	require('#spruce:schema/fields/fieldClassMap')
		// 	firstRun = false
		// }

		if (!FieldClassMap) {
			FieldClassMap = require('#spruce:schema/fields/fieldClassMap')
				.FieldClassMap
		}

		const fieldClass = FieldClassMap[definition.type]

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
