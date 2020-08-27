import { ISchemaFields } from '../schemas.static.types'

type FieldName<F extends ISchemaFields> = Extract<keyof F, string>
type MakeFieldsOptional<F extends ISchemaFields> = {
	[K in keyof F]: { isRequired: false } & Omit<F[K], 'isRequired'>
}

export default function makeFieldsOptional<
	F extends ISchemaFields,
	D extends FieldName<F>
>(fields: F): MakeFieldsOptional<F> {
	const optionalFields: Record<string, any> = {}

	Object.keys(fields).forEach((name) => {
		optionalFields[name] = {
			...fields[name],
			isRequired: false,
		}
	})

	return optionalFields as MakeFieldsOptional<F>
}
