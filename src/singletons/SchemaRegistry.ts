import SpruceError from '../errors/SpruceError'
import { ISchemasById } from '../fields/field.static.types'
import { ISchema } from '../schemas.static.types'
import validateSchema from '../utilities/validateSchema'

export default class SchemaRegistry {
	private schemasById: ISchemasById = {}
	private static instance: SchemaRegistry

	public static getInstance() {
		if (!this.instance) {
			this.instance = new SchemaRegistry()
		}
		return this.instance
	}

	public trackSchema(schema: ISchema) {
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
		try {
			this.getSchema(id, version, namespace)
			return true
		} catch {
			return false
		}
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

	public getSchema(id: string, version?: string, namespace?: string): ISchema {
		if (!this.schemasById[id]) {
			throw new SpruceError({
				code: 'SCHEMA_NOT_FOUND',
				schemaId: id,
				namespace,
				version,
			})
		}

		const namespaceMatches = namespace
			? this.schemasById[id].filter((d) => d.namespace === namespace)
			: this.schemasById[id]

		const versionMatch = namespaceMatches.find((d) => d.version === version)

		if (!versionMatch) {
			throw new SpruceError({
				code: 'VERSION_NOT_FOUND',
				schemaId: id,
				namespace,
			})
		}

		return versionMatch
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
