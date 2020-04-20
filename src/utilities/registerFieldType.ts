import { FieldSubclass } from '../fields/AbstractField'

export interface IFieldRegistration {
	/** The type that is used as the key to the enum */
	type: string

	/** The package that defined this field */
	package: string

	/** The name of this class based on class reference */
	className: string

	/** Pulls the description off the field */
	description: string
}

export interface IFieldRegistrationOptions {
	/** The package that defined this field */
	package: string

	/** The type that is used as the key to the enum */
	type: string

	/** The class */
	class: FieldSubclass
}

/** Register a new type of field */
export default function registerFieldType(
	options: IFieldRegistrationOptions
): IFieldRegistration {
	return {
		package: options.package,
		className: options.class.name,
		type: options.type,
		// TODO change this up when typescript supports static methods on a class
		// @ts-ignore
		description: options.class.templateDetails().description
	}
}
