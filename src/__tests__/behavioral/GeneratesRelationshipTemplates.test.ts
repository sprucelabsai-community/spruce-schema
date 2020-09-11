import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import SchemaField from '../../fields/SchemaField'
import { ISchemaFieldDefinition } from '../../fields/SchemaField.types'
import {
	IFieldTemplateDetailOptions,
	ISchemaTemplateItem,
	TemplateRenderAs,
} from '../../types/template.types'
import buildSchema from '../../utilities/buildSchema'

export default class GeneratesRelationshipTemplatesTest extends AbstractSpruceTest {
	private static wrenchSchema = buildSchema({
		id: 'wrench',
		name: 'Wrench',
		fields: {
			wrenchSize: {
				type: FieldType.Number,
				label: 'Size',
			},
		},
	})

	private static screwdriverSchema = buildSchema({
		id: 'screwdriver',
		name: 'Screwdriver',
		fields: {
			isFlathead: {
				type: FieldType.Boolean,
			},
			screwdriverLength: {
				type: FieldType.Number,
				label: 'Length',
			},
		},
	})

	private static personSchema = buildSchema({
		id: 'union-person',
		name: 'Union Person',
		fields: {
			favoriteTool: {
				type: FieldType.Schema,
				options: {
					schemas: [
						GeneratesRelationshipTemplatesTest.wrenchSchema,
						GeneratesRelationshipTemplatesTest.screwdriverSchema,
					],
				},
			},
			tools: {
				type: FieldType.Schema,
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
	private static templateItems: ISchemaTemplateItem[] = [
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
		'SpruceSchemas.Core.IUnionPerson',
		'SpruceSchemas.Core.IUnionPersonSchema'
	)
	@test(
		'schemaId isArray',
		{ isArray: true, options: { schemaId: { id: 'union-person' } } },
		'unionPersonSchema',
		'SpruceSchemas.Core.IUnionPerson[]',
		'SpruceSchemas.Core.IUnionPersonSchema'
	)
	@test(
		'schemaIds',
		{
			isArray: false,
			options: { schemaIds: [{ id: 'union-person' }, { id: 'wrench' }] },
		},
		'[unionPersonSchema, wrenchSchema]',
		"{ schemaId: 'union-person', values: SpruceSchemas.Core.IUnionPerson } | { schemaId: 'wrench', values: SpruceSchemas.Core.IWrench }",
		'(SpruceSchemas.Core.IUnionPersonSchema | SpruceSchemas.Core.IWrenchSchema)[]'
	)
	@test(
		'schemaIds isArray',
		{
			isArray: true,
			options: { schemaIds: [{ id: 'union-person' }, { id: 'wrench' }] },
		},
		'[unionPersonSchema, wrenchSchema]',
		"({ schemaId: 'union-person', values: SpruceSchemas.Core.IUnionPerson } | { schemaId: 'wrench', values: SpruceSchemas.Core.IWrench })[]",
		'(SpruceSchemas.Core.IUnionPersonSchema | SpruceSchemas.Core.IWrenchSchema)[]'
	)
	protected static async testTemplateDetails(
		definition: ISchemaFieldDefinition,
		renderAsValue: string,
		renderAsType: string,
		renderAsSchemaType: string
	) {
		const templateOptions: IFieldTemplateDetailOptions<ISchemaFieldDefinition> = {
			language: 'ts',
			globalNamespace: 'SpruceSchemas',
			importAs: 'generated_test',
			templateItems: GeneratesRelationshipTemplatesTest.templateItems,
			definition: {
				...definition,
				type: FieldType.Schema,
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
