import flatten from 'lodash/flatten'
import SpruceError from '../errors/SpruceError'
import { SchemasById } from '../fields/field.static.types'
import { Schema } from '../schemas.static.types'
import validateSchema from '../utilities/validateSchema'

export default class SchemaRegistry {
	private schemasById: SchemasById = {}
	private static instance: SchemaRegistry

	public static getInstance() {
		if (!this.instance) {
			this.instance = new SchemaRegistry()
		}
		return this.instance
	}

	public trackSchema(schema: Schema) {
		validateSchema(schema)

		const id = schema.id
		if (!this.schemasById[id]) {
			this.schemasById[id] = []
		}

		if (this.isTrackingSchema(schema.id, schema.version, schema.namespace)) {
			throw new SpruceError({
				code: 'DUPLICATE_SCHEMA',
				schemaId: schema.id,
				version: schema.version,
				namespace: schema.namespace,
			})
		}

		this.schemasById[id].push(schema)
	}

	public isTrackingSchema(
		id: string,
		version?: string,
		namespace?: string
	): boolean {
		if (
			!this.isTrackedById(id) ||
			!this.getSchemaNotThrowing(id, namespace, version)
		) {
			return false
		}
		return true
	}

	public getAllSchemas() {
		return flatten(Object.values(this.schemasById))
	}

	public getTrackingCount() {
		let count = 0
		Object.keys(this.schemasById).forEach((key) => {
			count += this.schemasById[key].length
		})
		return count
	}

	public forgetAllSchemas() {
		this.schemasById = {}
	}

	public getSchema(id: string, version?: string, namespace?: string): Schema {
		if (!this.isTrackedById(id)) {
			throw new SpruceError({
				code: 'SCHEMA_NOT_FOUND',
				schemaId: id,
				namespace,
				version,
			})
		}

		const versionMatch = this.getSchemaNotThrowing(id, namespace, version)

		if (!versionMatch) {
			throw new SpruceError({
				code: 'VERSION_NOT_FOUND',
				schemaId: id,
				namespace,
			})
		}

		return versionMatch
	}

	private getSchemaNotThrowing(
		id: string,
		namespace: string | undefined,
		version: string | undefined
	) {
		const namespaceMatches = namespace
			? this.schemasById[id].filter((d) => d.namespace === namespace)
			: this.schemasById[id]

		const versionMatch = namespaceMatches.find((d) => d.version === version)
		return versionMatch
	}

	private isTrackedById(id: string) {
		if (!this.schemasById[id]) {
			return false
		}
		return true
	}

	public forgetSchema(id: string, version?: string) {
		this.schemasById[id] = this.schemasById[id]?.filter(
			(schema) => !(schema.id === id && schema.version === version)
		)

		if (this.schemasById[id]?.length === 0) {
			delete this.schemasById[id]
		}
	}
}
