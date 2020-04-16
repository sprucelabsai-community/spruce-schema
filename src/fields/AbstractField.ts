import { FieldType } from '#spruce:schema/fields/fieldType'

export type IFieldDefinition<Value> = {
	/** The filed type */
	type: FieldType
	/** Default options are empty */
	options?: {}
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
	/** How this field is represented to the end-user as an html label or when collecting input from cli */
	label?: string
	/** Give an example of how someone should think about this field or give an example of what it may be */
	hint?: string
	/** Is this field required */
	isRequired?: boolean
} & (
	| {
			/** * If this element is an array */
			isArray: true
			/** The default for for this if no value is set */
			defaultValue?: Partial<Value>[]
			/** The current value for this field */
			value?: Value[]
	  }
	| {
			/** * If this value is NOT an array */
			isArray?: false | undefined
			/** The default value for this if no value is set */
			defaultValue?: Partial<Value>
			/** The current value for this field */
			value?: Value
	  }
)

export interface IFieldTemplateDetails {
	/** The type of value (string, number) */
	valueType: string

	/** A description of the field */
	description: string
}

/** A type that matches a subclass of the abstract field */
export type FieldSubclass = new (...args: any[]) => AbstractField<
	IFieldDefinition<unknown>
>

export default abstract class AbstractField<
	T extends IFieldDefinition<unknown>
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
