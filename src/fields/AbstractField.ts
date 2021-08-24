import { FieldDefinitions } from '#spruce/schemas/fields/fields.types'
import { InvalidFieldError } from '../errors/options.types'
import SpruceError from '../errors/SpruceError'
import {
	FieldTemplateDetails,
	FieldTemplateDetailOptions,
} from '../types/template.types'
import { ValidateOptions, Field } from './field.static.types'

export default abstract class AbstractField<F extends FieldDefinitions>
	implements Field<F>
{
	/** The definition for this field */
	public definition: F

	/** Shortcut to this field */
	public readonly type: F['type']

	/** The name of this field (camel case) */
	public name: string

	public constructor(name: string, definition: F) {
		this.definition = definition
		this.name = name
		this.type = definition.type
		return this
	}

	public static get description(): string {
		throw new SpruceError({
			code: 'NOT_IMPLEMENTED',
			instructions: `Copy and paste this into ${this.name}:

public static get description() {
	return '*** describe your field here ***'
}

`,
		})
	}

	/** For mapping schemas to types dynamically in schema values */
	public static generateTypeDetails(): { valueTypeMapper: string | undefined } {
		return {
			valueTypeMapper: undefined,
		}
	}

	/** Details needed for generating templates */
	public static generateTemplateDetails(
		_options: FieldTemplateDetailOptions<any>
	): FieldTemplateDetails {
		throw new SpruceError({
			code: 'NOT_IMPLEMENTED',
			instructions: `Copy and paste this into ${this.name}:
			
public static generateTemplateDetails(
	options: IFieldTemplateDetailOptions<I{{YourFieldName}}Definition>
): IFieldTemplateDetails {
	const { definition } = options
	return {
		valueType: \`string\${definition.isArray ? '[]' : ''}\`
	}
}`,
		})
	}

	public get options() {
		return this.definition.options
	}

	public get isRequired() {
		return !!this.definition.isRequired
	}

	public get isPrivate() {
		return !!this.definition.isPrivate
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

	public get minArrayLength() {
		return this.definition.minArrayLength ?? 1
	}

	public validate(value: any, _?: ValidateOptions<F>): InvalidFieldError[] {
		const errors: InvalidFieldError[] = []
		if ((typeof value === 'undefined' || value === null) && this.isRequired) {
			errors.push({
				code: 'missing_required',
				name: this.name,
				label: this.label,
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
