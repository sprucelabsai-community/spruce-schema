import { ISchemaNamedField, SchemaEntity } from './schemas.static.types'

export default abstract class AbstractEntity implements SchemaEntity {
	protected schema: any

	public get schemaId() {
		return this.schema.id
	}

	public get name() {
		return this.schema.name
	}

	public get namespace() {
		return this.schema.name
	}

	public get version() {
		return this.schema.version
	}

	public get description() {
		return this.schema.id
	}

	public constructor(schema: any) {
		this.schema = schema
	}

	public abstract get(fieldName: string, options?: Record<string, any>): any
	public abstract set(
		fieldName: string,
		value: any,
		options?: Record<string, any>
	): this
	public abstract getValues(options?: Record<string, any>): Record<string, any>
	public abstract setValues(values: Record<string, any>): this
	public abstract getNamedFields(
		options?: Record<string, any>
	): ISchemaNamedField<any>[]
	public abstract validate(options?: Record<string, any>): void
	public abstract isValid(options?: Record<string, any>): boolean
}
