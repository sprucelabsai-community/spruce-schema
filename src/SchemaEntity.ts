import { IInvalidFieldErrorOptions } from './errors/error.types'
import SpruceError from './errors/SpruceError'
import FieldFactory from './factories/FieldFactory'
import { ISchemasById } from './fields/field.static.types'
import {
	ISchema,
	SchemaPartialValues,
	SchemaFields,
	SchemaFieldNames,
	ISchemaNormalizeOptions,
	SchemaFieldValueType,
	ISchemaValidateOptions,
	SchemaDefaultValues,
	ISchemaGetValuesOptions,
	SchemaAllValues,
	ISchemaNamedFieldsOptions,
	ISchemaNamedField,
	ISchemaGetDefaultValuesOptions,
	SchemaFieldNamesWithDefaultValue,
	ISchemaEntity,
	SchemaPublicValues,
	SchemaPublicFieldNames,
} from './schemas.static.types'
import normalizeFieldValue, {
	normalizeValueToArray,
} from './utilities/normalizeFieldValue'

/** Universal schema class  */
export default class SchemaEntity<S extends ISchema>
	implements ISchemaEntity<S> {
	public static enableDuplicateCheckWhenTracking = true
	public static schemasById: ISchemasById = {}

	public get schemaId() {
		return this.schema.id
	}

	public get name() {
		return this.schema.name
	}

	public get version() {
		return this.schema.version
	}

	public get description() {
		return this.schema.id
	}

	private schema: S
	private values: SchemaPartialValues<S>
	private fields: SchemaFields<S>

	public constructor(schema: S, values?: SchemaPartialValues<S>) {
		this.schema = schema
		this.values = values ? values : {}
		this.fields = {} as SchemaFields<S>

		this.buildFields()
	}

	private buildFields() {
		const fieldDefinitions = this.schema.fields
		if (!fieldDefinitions) {
			throw new Error(
				`SchemaEntity requires fields. If you want to use dynamicFieldSignature, try DynamicSchemaEntity.`
			)
		}

		Object.keys(fieldDefinitions).forEach((name) => {
			const definition = fieldDefinitions[name]
			const field = FieldFactory.Field(name, definition)

			this.fields[name as SchemaFieldNames<S>] = field as any

			if (definition.value) {
				this.set(name as SchemaFieldNames<S>, definition.value)
			}
		})
	}

	private normalizeValue<
		F extends SchemaFieldNames<S>,
		CreateEntityInstances extends boolean = true
	>(
		forField: F,
		value: any,
		options?: ISchemaNormalizeOptions<S, CreateEntityInstances>
	): SchemaFieldValueType<S, F, CreateEntityInstances> {
		const field = this.fields[forField]

		const overrideOptions = {
			...(options ?? {}),
			...(options?.byField?.[forField] ?? {}),
		}

		return normalizeFieldValue(
			this.schemaId,
			this.name,
			SchemaEntity.schemasById,
			field,
			value,
			overrideOptions
		)
	}

	public get<
		F extends SchemaFieldNames<S>,
		CreateEntityInstances extends boolean = true
	>(
		fieldName: F,
		options: ISchemaNormalizeOptions<S, CreateEntityInstances> = {}
	): SchemaFieldValueType<S, F, CreateEntityInstances> {
		const value: SchemaFieldValueType<S, F> | undefined | null =
			this.values[fieldName] !== undefined ? this.values[fieldName] : undefined

		return this.normalizeValue(fieldName, value, options)
	}

	public set<F extends SchemaFieldNames<S>>(
		fieldName: F,
		value: SchemaFieldValueType<S, F>,
		options: ISchemaNormalizeOptions<S, false> = {}
	): this {
		const localValue = this.normalizeValue(fieldName, value, options)

		this.values[fieldName] = localValue

		return this
	}

	public isValid(options: ISchemaValidateOptions<S> = {}) {
		try {
			this.validate(options)
			return true
		} catch {
			return false
		}
	}

	public validate(options: ISchemaValidateOptions<S> = {}) {
		const errors: IInvalidFieldErrorOptions['errors'] = []

		this.getNamedFields(options).forEach((namedField) => {
			const { name, field } = namedField
			let valueArray = normalizeValueToArray(this.values[name])

			if (valueArray.length === 0) {
				valueArray = [undefined]
			}

			for (const value of valueArray) {
				const fieldErrors = field.validate(value, {
					schemasById: SchemaEntity.schemasById,
				})

				if (fieldErrors.length > 0) {
					errors.push(...fieldErrors)
				}
			}
		})

		if (errors.length > 0) {
			throw new SpruceError({
				code: 'INVALID_FIELD',
				schemaId: this.schemaId,
				schemaName: this.name,
				errors,
			})
		}
	}

	public getDefaultValues<
		F extends SchemaFieldNamesWithDefaultValue<
			S
		> = SchemaFieldNamesWithDefaultValue<S>,
		CreateEntityInstances extends boolean = true
	>(
		options: ISchemaGetDefaultValuesOptions<S, F, CreateEntityInstances> = {}
	): Pick<SchemaDefaultValues<S, CreateEntityInstances>, F> {
		const values: Partial<SchemaDefaultValues<S>> = {}

		this.getNamedFields().forEach((namedField) => {
			const { name, field } = namedField
			if (typeof field.definition.defaultValue !== 'undefined') {
				// @ts-ignore
				values[name] = this.normalizeValue(
					name,
					field.definition.defaultValue,
					options
				)
			}
		})
		return values as Pick<SchemaDefaultValues<S, CreateEntityInstances>, F>
	}

	public getValues<
		F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
		PF extends SchemaPublicFieldNames<S> = SchemaPublicFieldNames<S>,
		CreateEntityInstances extends boolean = true,
		IncludePrivateFields extends boolean = true
	>(
		options?: ISchemaGetValuesOptions<
			S,
			F,
			PF,
			CreateEntityInstances,
			IncludePrivateFields
		>
	): IncludePrivateFields extends false
		? Pick<SchemaPublicValues<S, CreateEntityInstances>, PF>
		: Pick<SchemaAllValues<S, CreateEntityInstances>, F> {
		const values: SchemaPartialValues<S, CreateEntityInstances> = {}

		const { fields = Object.keys(this.fields), includePrivateFields = true } =
			options || {}

		this.getNamedFields().forEach((namedField) => {
			const { name, field } = namedField
			if (
				fields.indexOf(name) > -1 &&
				(includePrivateFields || !field.isPrivate)
			) {
				const value = this.get(name, options)
				values[name] = value
			}
		})

		//@ts-ignore
		return values
	}

	public setValues(values: SchemaPartialValues<S>): this {
		this.getNamedFields().forEach((namedField) => {
			const { name } = namedField
			const value = values[name]
			if (typeof value !== 'undefined') {
				this.set(name, value as any)
			}
		})

		return this
	}

	public getNamedFields<F extends SchemaFieldNames<S>>(
		options: ISchemaNamedFieldsOptions<S, F> = {}
	): ISchemaNamedField<S>[] {
		const namedFields: ISchemaNamedField<S>[] = []
		const { fields = Object.keys(this.fields) as F[] } = options

		fields.forEach((name) => {
			const field = this.fields[name]
			namedFields.push({ name, field })
		})

		return namedFields
	}
}
