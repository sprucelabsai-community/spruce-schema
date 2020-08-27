import { ISchemaFields } from '../schemas.static.types'
type FieldName<F extends ISchemaFields> = Extract<keyof F, string>

export default function dropFields<
	F extends ISchemaFields,
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
