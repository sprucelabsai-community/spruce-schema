import { SchemaFieldsByName } from '../schemas.static.types'

type FieldName<F extends SchemaFieldsByName> = Extract<keyof F, string>
type MakeFieldsOptional<F extends SchemaFieldsByName> = {
	[K in keyof F]: { isRequired: false } & Omit<F[K], 'isRequired'>
}

export default function makeFieldsOptional<
	F extends SchemaFieldsByName,
	// eslint-disable-next-line
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
