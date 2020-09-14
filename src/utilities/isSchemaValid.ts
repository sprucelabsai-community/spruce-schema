import { ISchema } from '../schemas.static.types'
import validateSchema from './validateSchema'

export default function isSchemaValid(
	definition: unknown
): definition is ISchema {
	try {
		validateSchema(definition)
		return true
	} catch {
		return false
	}
}
