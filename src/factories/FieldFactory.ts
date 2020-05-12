import { FieldDefinition, IFieldMap } from '#spruce:schema/fields/fields.types'
import { FieldClassMap } from '#spruce:schema/fields/fieldClassMap'

export default class FieldFactory {
	/** Factory for creating a new field from a definition */
	public static field<F extends FieldDefinition>(
		name: string,
		definition: F,
		fieldClassMap: typeof FieldClassMap = FieldClassMap
	): IFieldMap[F['type']] {
		const fieldClass = fieldClassMap[definition.type]
		// @ts-ignore
		const field = new fieldClass(name, definition)
		return field
	}
}
