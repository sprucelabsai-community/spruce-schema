import { FieldDefinition } from '#spruce/schemas/fields/fields.types'
import { ErrorCode, IInvalidFieldError } from '../errors/error.types'
import SpruceError from '../errors/SpruceError'
import log from '../singletons/log'
import {
	IFieldTemplateDetails,
	IFieldTemplateDetailOptions
} from '../template.types'
import { ValidateOptions, IField } from './field.static.types'

export default abstract class AbstractField<F extends FieldDefinition>
	implements IField<F> {
	/** The definition for this field */
	public definition: F

	/** Shortcut to this field */
	public readonly type: F['type']

	/** The name of this field (camel case) */
	public readonly name: string

	public constructor(name: string, definition: F) {
		this.definition = definition
		this.name = name
		this.type = definition.type
		return this
	}

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

	public static get valueTypeGeneratorType(): string {
		return `I${this.name}Definition['value']`
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

	public get options() {
		return this.definition.options
	}

	public get isRequired() {
		return !!this.definition.isRequired
	}

	public get isArray() {
		return !!this.definition.isArray
	}

	public get label() {
		return this.definition.label
	}

	public get hint() {
		return this.definition.hint
	}

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
	public toValueType(value: any, _: any) {
		return value
	}
}
/** A field that comprises a schema */
