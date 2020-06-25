import { ErrorCode, IInvalidFieldError } from '../errors/error.types'
import SpruceError from '../errors/SpruceError'
import { ValidateOptions, IField } from '../schema.types'
import log from '../singletons/log'
import {
	IFieldTemplateDetails,
	IFieldTemplateDetailOptions
} from '../template.types'
import { FieldDefinition } from '#spruce:schema/fields/fields.types'

export default abstract class AbstractField<F extends FieldDefinition>
	implements IField<F> {
	/** The definition for this field */
	public definition: F

	/** Shortcut to this field */
	public type: F['type']

	/** The name of this field (camel case) */
	public name: string

	/** Construct a new field based on the definition */
	public constructor(name: string, definition: F) {
		this.definition = definition
		this.name = name
		this.type = definition.type
		return this
	}

	/** A description of this field for others */
	public static get description(): string {
		throw new SpruceError({
			code: ErrorCode.NotImplemented,
			instructions: `Copy and paste this into ${this.name}:

public static get description() {
	return '*** describe your field here ***'
}

`
		})
	}

	/** Details needed for generating templates */
	public static generateTemplateDetails(
		options: IFieldTemplateDetailOptions<any>
	): IFieldTemplateDetails {
		log.info(options)
		throw new SpruceError({
			code: ErrorCode.NotImplemented,
			instructions: `Copy and paste this into ${this.name}:
			
public static generateTemplateDetails(
	options: IFieldTemplateDetailOptions<I{{YourFieldName}}Definition>
): IFieldTemplateDetails {
	const { definition } = options
	return {
		valueType: \`string\${definition.isArray ? '[]' : ''}\`
	}
}`
		})
	}

	/** Get options defined for this field */
	public get options() {
		return this.definition.options
	}

	/** Is this field required */
	public get isRequired() {
		return !!this.definition.isRequired
	}

	/** Is this field an array? */
	public get isArray() {
		return !!this.definition.isArray
	}

	/** The label for this field */
	public get label() {
		return this.definition.label
	}

	/** The hint for this field */
	public get hint() {
		return this.definition.hint
	}

	/** Validate a value against this field */
	public validate(value: any, _?: ValidateOptions<F>): IInvalidFieldError[] {
		const errors: IInvalidFieldError[] = []
		if ((typeof value === 'undefined' || value === null) && this.isRequired) {
			errors.push({
				code: 'missing_required',
				friendlyMessage: `${this.name} is required!`,
				name: this.name
			})
		}

		return errors
	}

	/** Transform any value to the value type of this field */
	public toValueType(value: any) {
		return value
	}
}
