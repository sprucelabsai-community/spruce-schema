import { Schema } from '../schemas.static.types'
import validateSchema from './validateSchema'

export default function isSchemaValid(
	definition: unknown
): definition is Schema {
	try {
		validateSchema(definition)
		return true
	} catch {
		return false
	}
}
