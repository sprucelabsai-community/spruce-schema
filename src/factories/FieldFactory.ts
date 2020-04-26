import { FieldDefinition } from '#spruce:schema/fields/fields.types'
import { FieldClassMap } from '#spruce:schema/fields/fieldClassMap'
import { IField } from '../schema.types'
import { FieldType } from '#spruce:schema/fields/fieldType'

export default class FieldFactory {
	/** Factory for creating a new field from a definition */
	public static field<F extends FieldDefinition>(
		name: string,
		definition: F,
		fieldClassMap: Record<FieldType, any> = FieldClassMap
	): IField<F> {
		const fieldClass = fieldClassMap[definition.type]
		// TODO determine once and for-all how we type for strategy pattern
		// @ts-ignore
		const field = new fieldClass(name, definition)
		return field
	}
}
