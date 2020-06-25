import SpruceError from '../errors/SpruceError'
import { ErrorCode } from '../errors/error.types'
import { FieldSubclass } from '../schema.types'

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
}

export interface IFieldRegistrationOptions {
	/** The package that defined this field */
	package: string

	/** The type that is used as the key to the enum */
	type: string

	/** The class */
	class: FieldSubclass<any>

	/** How should this field be imported (SpruceSchema) */
	importAs: string
}

/** Validator to see if registrations are good */
export function validateFieldRegistration(
	registration: any
): asserts registration is IFieldRegistration {
	const errors: string[] = []

	const builtRegistration: IFieldRegistration = {
		package: '***missing***',
		className: '***missing***',
		type: '***missing***',
		importAs: '***missing***',
		description: '***missing***'
	}

	if (typeof registration !== 'object') {
		errors.push('field_registration_must_be_object')
	} else {
		Object.keys(builtRegistration).forEach(key => {
			if (typeof registration[key] !== 'string') {
				errors.push(`${key}_must_be_string`)
			} else {
				builtRegistration[key as keyof IFieldRegistration] = registration[key]
			}
		})
	}

	if (errors.length > 0) {
		throw new SpruceError({
			code: ErrorCode.InvalidFieldRegistration,
			...builtRegistration
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
		description: options.class.description
	}

	validateFieldRegistration(registration)
	return registration
}
