import SpruceError from '../errors/SpruceError'
import { FieldSubclass } from '../fields/field.static.types'

export interface IFieldRegistration {
	/** The type that is used as the key to the enum */
	type: string
	/** The package that defined this field */
	package: string
	/** The name of this class based on class reference */
	className: string
	/** Pulls the description off the field */
	description: string
	/** How should this field be imported (SpruceSchema) */
	importAs: string
	/** The type mapper responsible for handling SchemaValues mapping of schema to interface of values */
	valueTypeMapper?: string
}

export interface IFieldRegistrationOptions {
	/** The package that defined this field, like @sprucelabs/schema */
	package: string

	/** The type that is used as the key to the enum, auto PascalCased */
	type: string

	/** A reference to the class of the field */
	class: FieldSubclass<any>

	/** How should this field be imported (import * as {{importAs}} from {{package}}) */
	importAs: string
}

export function validateFieldRegistration(
	registration: IFieldRegistration
	// eslint-disable-next-line no-undef
): asserts registration is IFieldRegistration {
	const errors: string[] = []

	const builtRegistration: IFieldRegistration = {
		package: '***missing***',
		className: '***missing***',
		type: '***missing***',
		importAs: '***missing***',
		description: '***missing***',
	}

	if (typeof registration !== 'object') {
		errors.push('field_registration_must_be_object')
	} else {
		Object.keys(builtRegistration).forEach((untypedKey) => {
			const key = untypedKey as keyof IFieldRegistration
			if (typeof registration[key] !== 'string') {
				errors.push(`${key}_must_be_string`)
			} else {
				//@ts-ignore
				builtRegistration[key] = registration[key]
			}
		})
	}

	if (errors.length > 0) {
		throw new SpruceError({
			code: 'INVALID_FIELD_REGISTRATION',
			...builtRegistration,
		})
	}
}

/** Register a new type of field */
export default function registerFieldType(
	options: IFieldRegistrationOptions
): IFieldRegistration {
	const registration = {
		package: options.package,
		className: options.class.name,
		type: options.type,
		importAs: options.importAs,
		// TODO change this up when typescript supports typing static methods on a class
		// @ts-ignore
		description: options.class.description,
		// TODO change this up when typescript supports typing static methods on a class
		// @ts-ignore
		...options.class.generateTypeDetails(),
	}

	validateFieldRegistration(registration)

	return registration
}
