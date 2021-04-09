import AbstractEntity from './AbstractEntity'
import { InvalidFieldErrorOptions } from './errors/error.types'
import SpruceError from './errors/SpruceError'
import FieldFactory from './factories/FieldFactory'
import {
	Schema,
	StaticSchemaPartialValues,
	SchemaFields,
	SchemaFieldNames,
	SchemaNormalizeOptions,
	SchemaFieldValueType,
	SchemaValidateOptions,
	SchemaDefaultValues,
	SchemaGetValuesOptions,
	SchemaAllValues,
	SchemaNamedFieldsOptions,
	SchemaNamedField,
	SchemaGetDefaultValuesOptions,
	SchemaFieldNamesWithDefaultValue,
	StaticSchemaEntity,
	SchemaPublicValues,
	SchemaPublicFieldNames,
} from './schemas.static.types'
import normalizeFieldValue, {
	normalizeValueToArray,
} from './utilities/normalizeFieldValue'

/** Universal schema class  */
export default class StaticSchemaEntityImplementation<S extends Schema>
	extends AbstractEntity
	implements StaticSchemaEntity<S> {
	public static enableDuplicateCheckWhenTracking = true

	protected schema: S
	private values: StaticSchemaPartialValues<S>
	private fields: SchemaFields<S>

	public constructor(schema: S, values?: StaticSchemaPartialValues<S>) {
		super(schema)

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
		options?: SchemaNormalizeOptions<S, CreateEntityInstances>
	): SchemaFieldValueType<S, F, CreateEntityInstances> {
		const field = this.fields[forField]

		const overrideOptions = {
			...(options ?? {}),
			...(options?.byField?.[forField] ?? {}),
		}

		return normalizeFieldValue(
			this.schemaId,
			this.name,
			{},
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
		options: SchemaNormalizeOptions<S, CreateEntityInstances> = {}
	): SchemaFieldValueType<S, F, CreateEntityInstances> {
		const value: SchemaFieldValueType<S, F> | undefined | null =
			this.values[fieldName] !== undefined ? this.values[fieldName] : undefined

		return this.normalizeValue(fieldName, value, options)
	}

	public set<F extends SchemaFieldNames<S>>(
		fieldName: F,
		value: SchemaFieldValueType<S, F>,
		options: SchemaNormalizeOptions<S, false> = {}
	): this {
		const localValue = this.normalizeValue(fieldName, value, options)

		this.values[fieldName] = localValue

		return this
	}

	public isValid(options: SchemaValidateOptions<S> = {}) {
		try {
			this.validate(options)
			return true
		} catch {
			return false
		}
	}

	private pluckExtraFields(values: StaticSchemaPartialValues<S>, schema: S) {
		const extraFields: string[] = []
		if (schema.fields) {
			const passedFields = Object.keys(values)
			const expectedFields = Object.keys(schema.fields)

			passedFields.forEach((passed) => {
				if (expectedFields.indexOf(passed) === -1) {
					extraFields.push(passed)
				}
			})
		}
		return extraFields
	}

	public validate(options: SchemaValidateOptions<S> = {}) {
		const errors: InvalidFieldErrorOptions['errors'] = []

		const extraFields: string[] = this.pluckExtraFields(
			this.values,
			this.schema
		)

		if (extraFields.length > 0) {
			extraFields.forEach((name) => {
				errors.push({
					name,
					code: 'unexpected',
					friendlyMessage: `\`${name}\` is not a field on \`${this.schemaId}\`.`,
				})
			})
		}

		this.getNamedFields(options).forEach((namedField) => {
			const { name, field } = namedField
			let valueArray = normalizeValueToArray(this.values[name])

			if (field.isRequired && valueArray.length < field.minArrayLength) {
				errors.push({
					code: 'missing_required',
					name,
					friendlyMessage: `'${field.label ?? field.name}' must have at least ${
						field.minArrayLength
					} values. I only found ${valueArray.length}!`,
				})
			} else {
				for (const value of valueArray) {
					const fieldErrors = field.validate(value, {
						schemasById: {},
					})

					if (fieldErrors.length > 0) {
						errors.push(...fieldErrors)
					}
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
		F extends SchemaFieldNamesWithDefaultValue<S> = SchemaFieldNamesWithDefaultValue<S>,
		CreateEntityInstances extends boolean = true
	>(
		options: SchemaGetDefaultValuesOptions<S, F, CreateEntityInstances> = {}
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
		return values as any
	}

	public getValues<
		F extends SchemaFieldNames<S> = SchemaFieldNames<S>,
		PF extends SchemaPublicFieldNames<S> = SchemaPublicFieldNames<S>,
		CreateEntityInstances extends boolean = true,
		IncludePrivateFields extends boolean = true
	>(
		options?: SchemaGetValuesOptions<
			S,
			F,
			PF,
			CreateEntityInstances,
			IncludePrivateFields
		>
	): IncludePrivateFields extends false
		? Pick<SchemaPublicValues<S, CreateEntityInstances>, PF>
		: Pick<SchemaAllValues<S, CreateEntityInstances>, F> {
		const values: StaticSchemaPartialValues<S, CreateEntityInstances> = {}

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

	public setValues(values: StaticSchemaPartialValues<S>): this {
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
		options: SchemaNamedFieldsOptions<S, F> = {}
	): SchemaNamedField<S>[] {
		const namedFields: SchemaNamedField<S>[] = []
		const { fields = Object.keys(this.fields) as F[] } = options

		fields.forEach((name) => {
			const field = this.fields[name]
			namedFields.push({ name, field })
		})

		return namedFields
	}
}
