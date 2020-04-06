import { FieldType, IFieldDefinition } from '.'
import { FieldClassMap, IFieldMap } from './types'

export interface IBaseFieldDefinition {
	/** The type of field this is, will strongly type props for us */
	type: FieldType
	/** Generates in only for local interface and does not share with other skills */
	isPrivate?: boolean
	/** The permissions used in different contexts */
	acls?: {
		create: {
			[slug: string]: string[]
		}
		read: {
			[slug: string]: string[]
		}
		update: {
			[slug: string]: string[]
		}
		delete: {
			[slug: string]: string[]
		}
	}
	/** Does this value store more than one item? */
	isArray?: boolean
	/** How this field is represented to the end-user as an html label or when collecting input from cli */
	label?: string
	/** Give an example of how someone should think about this field or give an example of what it may be */
	hint?: string
	/** The default for for this if no value is set */
	defaultValue?: any
	/** The current value for this field */
	value?: any
	/** Is this field required */
	isRequired?: boolean
	/** Unique options overridden by the fields that extend it */
	options?: Record<string, any>
}

export interface IFieldTemplateDetails {
	/** The interface name as a string literal 'IBooleanFieldDefinition' */
	definitionInterface: string

	/** The type of value (string, number) */
	valueType: string
}

export default abstract class BaseField<
	T extends IFieldDefinition = IFieldDefinition
> {
	/** The definition for this field */
	public definition: T

	public constructor(definition: T) {
		this.definition = definition
	}

	/** Details needed for generating templates */
	public static templateDetails(): IFieldTemplateDetails {
		throw new Error('field types must implement public static templateDetails')
	}

	/** Factory for creating a new field from a definition */
	public static field<
		F extends IFieldDefinition,
		R extends IFieldMap[F['type']]
	>(definition: F, fieldClassMap = FieldClassMap): R {
		// @ts-ignore - TODO figure out how to properly instantiate based on the class map
		const fieldClass = fieldClassMap[definition.type]
		// @ts-ignore - TODO figure out how to properly instantiate based on the class map
		const field = new fieldClass(definition)
		return field as R
	}

	/** Get the type off the definition */
	public getType() {
		return this.definition.type
	}

	/** Get options defined for this field */
	public getOptions() {
		return this.definition.options
	}

	/** Is this field required */
	public isRequired() {
		return !!this.definition.isRequired
	}

	/** Is this field an array? */
	public isArray() {
		return !!this.definition.isArray
	}

	/** The label for this field */
	public getLabel() {
		return this.definition.label
	}

	/** The hint for this field */
	public getHint() {
		return this.definition.hint
	}

	/** Validate a value against this field */
	public validate(value: any): string[] {
		const errors = []
		if ((typeof value === 'undefined' || value === null) && this.isRequired()) {
			errors.push('missing_required')
		}

		return errors
	}

	/** Transform any value to the value type of this field */
	public toValueType(value: any): any {
		return value
	}
}
