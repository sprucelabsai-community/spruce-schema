import { FieldName } from '../fields/field.static.types'
import { SchemaFieldsByName } from '../schemas.static.types'

export default function pickFields<
	F extends SchemaFieldsByName,
	Name extends FieldName<F>
>(fields: F, names: Name[]): Pick<F, Name> {
	const final: any = {}

	for (const name of names) {
		final[name] = fields[name]
	}

	return final
}
