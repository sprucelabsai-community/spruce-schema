import { FieldType, IFieldDefinition } from '.'
import { FieldClassMap, Field } from './types'

export interface IFieldBaseDefinition {
	/** the type of field this is, will strongly type props for us */
	type: FieldType
	/** generates in only for local interface and does not share with other skills */
	isPrivate?: boolean
	/** the permissions used in different contexts */
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
	/** does this value store more than one item? */
	isArray?: boolean
	/** how this field is represented to the end-user as an html label or when collecting input from cli */
	label?: string
	/** give an example of how someone should think about this field or give an example of what it may be */
	hint?: string
	/** the default for for this if no value is set */
	defaultValue?: any
	/** the curret value for this field */
	value?: any
	/** is this field required */
	isRequired?: boolean
	/** unique options overriden by the fields that extend it */
	options?: Record<string, any>
}

export interface IFieldTemplateDetails {

	/** the interface name as a string literal 'IFieldBooleanDefinition' */
	definitionInterface: string

	/** the type of value (string, number) */
	valueType: string
}

export default abstract class FieldBase<
	T extends IFieldDefinition = IFieldDefinition
> {
	/** the definition for this field */
	public definition: T

	public constructor(definition: T) {
		this.definition = definition
	}

	/** details needed for generating templates */
	public static templateDetails(): IFieldTemplateDetails {
		throw new Error('field types must implement public static templateDetails')
	}

	/** factory for creating a new field from a definition */
	public static field(
		definition: IFieldDefinition,
		fieldClassMap = FieldClassMap
	): Field {
		const fieldClass = fieldClassMap[definition.type]
		// @ts-ignore understand how to instantiate a field class correctly
		const field = new fieldClass(definition)
		return field
	}

	/** get the type off the definition */
	public getType() {
		return this.definition.type
	}

	/** get options defined for this field */
	public getOptions() {
		return this.definition.options
	}

	/** is this field required */
	public isRequired() {
		return !!this.definition.isRequired
	}

	/** is this field an array? */
	public isArray() {
		return !!this.definition.isArray
	}

	/** the label for this field */
	public getLabel() {
		return this.definition.label
	}

	/** the hint for this field */
	public getHint() {
		return this.definition.hint
	}

	/** validate a value against this field */
	public validate(value: any): string[] {
		const errors = []
		if ((typeof value === 'undefined' || value === null) && this.isRequired()) {
			errors.push('missing_required')
		}

		return errors
	}

	/** transform any value to the value type of this field */
	public toValueType = (value: any): any => {
		return value
	}
}
