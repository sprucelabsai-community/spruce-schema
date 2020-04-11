import {
	FieldDefinition,
	FieldClassMap,
	IFieldClassMap
} from '#spruce:schema/types'

export default class FieldFactory {
	/** Factory for creating a new field from a definition */
	public static field<
		F extends FieldDefinition,
		R extends IFieldClassMap[F['type']]
	>(definition: F, fieldClassMap = FieldClassMap): R {
		const fieldClass = fieldClassMap[definition.type]
		// @ts-ignore - TODO figure out how to properly instantiate based on the class map
		const field = new fieldClass(definition)
		return field as R
	}
}
