import { ISchema } from '../schemas.static.types'

export default function areSchemasTheSame(
	left: ISchema,
	right: ISchema
): boolean {
	if (left.id !== right.id) {
		return false
	}

	const fields1 = Object.keys(left.fields ?? {}).sort()
	const fields2 = Object.keys(right.fields ?? {}).sort()

	if (fields1.join('|') !== fields2.join('|')) {
		return false
	}

	// TODO let fields compare their definitions

	return true
}
