import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import SchemaField from '../../fields/SchemaField'
import { SchemaFieldFieldDefinition } from '../../fields/SchemaField.types'
import {
	FieldTemplateDetailOptions,
	SchemaTemplateItem,
	TemplateRenderAs,
} from '../../types/template.types'
import buildSchema from '../../utilities/buildSchema'

export default class GeneratesRelationshipTemplatesTest extends AbstractSpruceTest {
	private static wrenchV1Schema = buildSchema({
		id: 'wrench',
		name: 'Wrench',
		version: 'v1',
		fields: {
			wrenchSize: {
				type: 'number',
				label: 'Size',
			},
		},
	})

	private static wrenchV2Schema = buildSchema({
		id: 'wrench',
		name: 'Wrench',
		version: 'v2',
		fields: {
			wrenchSize: {
				type: 'number',
				label: 'Size',
			},
		},
	})

	private static screwdriverSchema = buildSchema({
		id: 'screwdriver',
		name: 'Screwdriver',
		fields: {
			isFlathead: {
				type: 'boolean',
			},
			screwdriverLength: {
				type: 'number',
				label: 'Length',
			},
		},
	})

	private static personSchema = buildSchema({
		id: 'union-person',
		name: 'Union Person',
		fields: {
			favoriteTool: {
				type: 'schema',
				options: {
					schemas: [
						GeneratesRelationshipTemplatesTest.wrenchV1Schema,
						GeneratesRelationshipTemplatesTest.wrenchV2Schema,
						GeneratesRelationshipTemplatesTest.screwdriverSchema,
					],
				},
			},
			tools: {
				type: 'schema',
				isArray: true,
				options: {
					schemas: [
						GeneratesRelationshipTemplatesTest.wrenchV1Schema,
						GeneratesRelationshipTemplatesTest.wrenchV2Schema,
						GeneratesRelationshipTemplatesTest.screwdriverSchema,
					],
				},
			},
		},
	})

	// the global template items[]
	private static templateItems: SchemaTemplateItem[] = [
		{
			namePascal: 'UnionPerson',
			nameCamel: 'unionPerson',
			nameReadable: 'Union person',
			namespace: 'Core',
			id: GeneratesRelationshipTemplatesTest.personSchema.id,
			schema: GeneratesRelationshipTemplatesTest.personSchema,
			destinationDir: '#spruce/schemas',
		},
		{
			namePascal: 'Wrench',
			nameCamel: 'wrench',
			nameReadable: 'Wrench',
			namespace: 'Core',
			id: GeneratesRelationshipTemplatesTest.wrenchV1Schema.id,
			schema: GeneratesRelationshipTemplatesTest.wrenchV1Schema,
			destinationDir: '#spruce/schemas',
		},
		{
			namePascal: 'Wrench',
			nameCamel: 'wrench',
			nameReadable: 'Wrench',
			namespace: 'Core',
			id: GeneratesRelationshipTemplatesTest.wrenchV2Schema.id,
			schema: GeneratesRelationshipTemplatesTest.wrenchV2Schema,
			destinationDir: '#spruce/schemas',
		},
		{
			namePascal: 'screwdriver',
			nameCamel: 'screwdriver',
			nameReadable: 'Screwdriver',
			namespace: 'Core',
			id: GeneratesRelationshipTemplatesTest.screwdriverSchema.id,
			schema: GeneratesRelationshipTemplatesTest.screwdriverSchema,
			destinationDir: '#spruce/schemas',
		},
	]

	@test(
		'single value',
		{
			isArray: false,
			options: {
				schemaIds: [{ id: 'union-person' }, { id: 'wrench', version: 'v2' }],
			},
		},
		'[unionPersonSchema, wrenchSchema]',
		"{ schemaId: 'union-person', values: SpruceSchemas.Core.UnionPerson } | { schemaId: 'wrench', version: 'v2', values: SpruceSchemas.Core.v2.Wrench }",
		'(SpruceSchemas.Core.UnionPersonSchema | SpruceSchemas.Core.v2.WrenchSchema)[]'
	)
	@test(
		'is array',
		{
			isArray: true,
			options: {
				schemaIds: [{ id: 'union-person' }, { id: 'wrench', version: 'v1' }],
			},
		},
		'[unionPersonSchema, wrenchSchema]',
		"({ schemaId: 'union-person', values: SpruceSchemas.Core.UnionPerson } | { schemaId: 'wrench', version: 'v1', values: SpruceSchemas.Core.v1.Wrench })[]",
		'(SpruceSchemas.Core.UnionPersonSchema | SpruceSchemas.Core.v1.WrenchSchema)[]'
	)
	protected static async testTemplateDetails(
		definition: SchemaFieldFieldDefinition,
		renderAsValue: string,
		renderAsType: string,
		renderAsSchemaType: string
	) {
		const templateOptions: FieldTemplateDetailOptions<SchemaFieldFieldDefinition> = {
			language: 'ts',
			globalNamespace: 'SpruceSchemas',
			importAs: 'generated_test',
			templateItems: GeneratesRelationshipTemplatesTest.templateItems,
			definition: {
				...definition,
				type: 'schema',
			},
			renderAs: TemplateRenderAs.Type, // is overwritten below
		}

		const expected = {
			renderAsValue,
			renderAsType,
			renderAsSchemaType,
		}

		const rendersAs = Object.getOwnPropertyNames(TemplateRenderAs)

		rendersAs.forEach((renderAs) => {
			const options = {
				...templateOptions,
				// @ts-ignore
				renderAs: TemplateRenderAs[renderAs],
			}
			const { valueType } = SchemaField.generateTemplateDetails(options)
			const exp = expected[`renderAs${renderAs}` as keyof typeof expected]

			assert.isEqual(valueType, exp)
		})
	}

	@test('missing version non array value', {
		isArray: false,
		options: { schemaIds: [{ id: 'union-person' }, { id: 'wrench' }] },
	})
	@test('missing version array value', {
		isArray: true,
		options: { schemaId: { id: 'wrench' } },
	})
	protected static async throwsMissingVersion(
		definition: SchemaFieldFieldDefinition
	) {
		const templateOptions: FieldTemplateDetailOptions<SchemaFieldFieldDefinition> = {
			language: 'ts',
			globalNamespace: 'SpruceSchemas',
			importAs: 'generated_test',
			templateItems: GeneratesRelationshipTemplatesTest.templateItems,
			definition: {
				...definition,
				type: 'schema',
			},
			renderAs: TemplateRenderAs.Type, // is overwritten below
		}

		const rendersAs = Object.getOwnPropertyNames(TemplateRenderAs)

		await Promise.all(
			rendersAs.map(async (renderAs) => {
				const options = {
					...templateOptions,
					// @ts-ignore
					renderAs: TemplateRenderAs[renderAs],
				}

				assert.doesThrow(
					() => SchemaField.generateTemplateDetails(options),
					/VERSION/
				)
			})
		)
	}
}
