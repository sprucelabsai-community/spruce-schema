import { FieldName } from '../fields/field.static.types'
import { SchemaFieldsByName } from '../schemas.static.types'

export default function dropFields<
	F extends SchemaFieldsByName,
	D extends FieldName<F>
>(fields: F, dropFields: D[]): Omit<F, D> {
	const optionalFields: Record<string, any> = {}

	Object.keys(fields).forEach((name) => {
		if (!dropFields || dropFields.indexOf(name as D) === -1) {
			optionalFields[name] = {
				...fields[name],
			}
		}
	})

	return optionalFields as Omit<F, D>
}
