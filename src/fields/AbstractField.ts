import SchemaError from '../errors/SchemaError'
import log from '../lib/log'
import { SchemaErrorCode } from '../errors/error.types'
import {
	IValidateOptions,
	IToValueTypeOptions,
	FieldDefinitionValueType
} from '../schema.types'
import {
	IFieldTemplateDetails,
	IFieldTemplateDetailOptions
} from '../template.types'
import { FieldDefinition } from '#spruce:schema/fields/fields.types'

export default abstract class AbstractField<F extends FieldDefinition> {
	/** The definition for this field */
	public definition: F

	/** Construct a new field based on the definition */
	public constructor(definition: F) {
		this.definition = definition
	}

	/** A description of this field for others */
	public static get description(): string {
		throw new SchemaError({
			code: SchemaErrorCode.NotImplemented,
			instructions: `Copy and paste this into ${this.name}:

public static get description() {
	return '*** describe your field here ***'
}

`
		})
	}

	/** Details needed for generating templates */
	public static templateDetails(
		options: IFieldTemplateDetailOptions<any>
	): IFieldTemplateDetails {
		log.info(options)
		throw new SchemaError({
			code: SchemaErrorCode.NotImplemented,
			instructions: `Copy and paste this into ${this.name}:
			
public static templateDetails(
	options: IFieldTemplateDetailOptions<I{{YourFieldName}}Definition>
): IFieldTemplateDetails {
	const { definition } = options
	return {
		valueType: \`string\${definition.isArray ? '[]' : ''}\`
	}
}`
		})
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
	public validate(value: any, _?: IValidateOptions): string[] {
		const errors = []
		if ((typeof value === 'undefined' || value === null) && this.isRequired()) {
			errors.push('missing_required')
		}

		return errors
	}

	/** Transform any value to the value type of this field */
	public toValueType<CreateSchemaInstances extends boolean>(
		value: any,
		_?: IToValueTypeOptions<CreateSchemaInstances>
	): FieldDefinitionValueType<F, CreateSchemaInstances> {
		return value
	}
}
