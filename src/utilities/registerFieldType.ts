import { AbstractField } from '../fields'

export interface IFieldRegistrationOptions {
	/** The name of the field, like Text or DateTime */
	package: string

	/** The class */
	class: typeof AbstractField
}

/** Register a new type of field */
export default function registerFieldType(options: IFieldRegistrationOptions) {
	return options
}
