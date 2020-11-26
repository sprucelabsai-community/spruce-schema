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
	private static wrenchSchema = buildSchema({
		id: 'wrench',
		name: 'Wrench',
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
						GeneratesRelationshipTemplatesTest.wrenchSchema,
						GeneratesRelationshipTemplatesTest.screwdriverSchema,
					],
				},
			},
			tools: {
				type: 'schema',
				isArray: true,
				options: {
					schemas: [
						GeneratesRelationshipTemplatesTest.wrenchSchema,
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
			id: GeneratesRelationshipTemplatesTest.wrenchSchema.id,
			schema: GeneratesRelationshipTemplatesTest.wrenchSchema,
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
		'schemaId',
		{ isArray: false, options: { schemaId: { id: 'union-person' } } },
		'unionPersonSchema',
		'SpruceSchemas.Core.UnionPerson',
		'SpruceSchemas.Core.UnionPersonSchema'
	)
	@test(
		'schemaId isArray',
		{ isArray: true, options: { schemaId: { id: 'union-person' } } },
		'unionPersonSchema',
		'SpruceSchemas.Core.UnionPerson[]',
		'SpruceSchemas.Core.UnionPersonSchema'
	)
	@test(
		'schemaIds',
		{
			isArray: false,
			options: { schemaIds: [{ id: 'union-person' }, { id: 'wrench' }] },
		},
		'[unionPersonSchema, wrenchSchema]',
		"{ schemaId: 'union-person', values: SpruceSchemas.Core.UnionPerson } | { schemaId: 'wrench', values: SpruceSchemas.Core.Wrench }",
		'(SpruceSchemas.Core.UnionPersonSchema | SpruceSchemas.Core.WrenchSchema)[]'
	)
	@test(
		'schemaIds isArray',
		{
			isArray: true,
			options: { schemaIds: [{ id: 'union-person' }, { id: 'wrench' }] },
		},
		'[unionPersonSchema, wrenchSchema]',
		"({ schemaId: 'union-person', values: SpruceSchemas.Core.UnionPerson } | { schemaId: 'wrench', values: SpruceSchemas.Core.Wrench })[]",
		'(SpruceSchemas.Core.UnionPersonSchema | SpruceSchemas.Core.WrenchSchema)[]'
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
}
