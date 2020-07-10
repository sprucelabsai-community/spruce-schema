import Schema from '../Schema'
import { ISchemaDefinition } from '../schemas.static.types'

export default function validateSchemaValues<T extends ISchemaDefinition>(
	definition: T,
	values: any
) {
	const instance = new Schema(definition, values)
	instance.validate()
}
