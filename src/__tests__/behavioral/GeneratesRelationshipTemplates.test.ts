import BaseTest, { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import SchemaField from '../../fields/SchemaField'
import { ISchemaFieldDefinition } from '../../fields/SchemaField.types'
import {
	IFieldTemplateDetailOptions,
	ISchemaTemplateItem,
	TemplateRenderAs,
} from '../../template.types'
import buildSchemaDefinition from '../../utilities/buildSchemaDefinition'

export default class GeneratesRelationshipTemplatesTest extends BaseTest {
	private static wrenchDefinition = buildSchemaDefinition({
		id: 'wrench',
		name: 'Wrench',
		fields: {
			wrenchSize: {
				type: FieldType.Number,
				label: 'Size',
			},
		},
	})

	private static screwdriverDefinition = buildSchemaDefinition({
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

	private static personDefinition = buildSchemaDefinition({
		id: 'union-person',
		name: 'Union Person',
		fields: {
			favoriteTool: {
				type: FieldType.Schema,
				options: {
					schemas: [
						GeneratesRelationshipTemplatesTest.wrenchDefinition,
						GeneratesRelationshipTemplatesTest.screwdriverDefinition,
					],
				},
			},
			tools: {
				type: FieldType.Schema,
				isArray: true,
				options: {
					schemas: [
						GeneratesRelationshipTemplatesTest.wrenchDefinition,
						GeneratesRelationshipTemplatesTest.screwdriverDefinition,
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
			id: GeneratesRelationshipTemplatesTest.personDefinition.id,
			definition: GeneratesRelationshipTemplatesTest.personDefinition,
		},
		{
			namePascal: 'Wrench',
			nameCamel: 'wrench',
			nameReadable: 'Wrench',
			namespace: 'Core',
			id: GeneratesRelationshipTemplatesTest.wrenchDefinition.id,
			definition: GeneratesRelationshipTemplatesTest.wrenchDefinition,
		},
		{
			namePascal: 'screwdriver',
			nameCamel: 'screwdriver',
			nameReadable: 'Screwdriver',
			namespace: 'Core',
			id: GeneratesRelationshipTemplatesTest.screwdriverDefinition.id,
			definition: GeneratesRelationshipTemplatesTest.screwdriverDefinition,
		},
	]

	@test(
		'schemaId',
		{ isArray: false, options: { schemaId: { id: 'union-person' } } },
		'[unionPersonDefinition]',
		'SpruceSchemas.Core.IUnionPerson',
		'SpruceSchemas.Core.UnionPerson.IDefinition[]'
	)
	@test(
		'schemaId isArray',
		{ isArray: true, options: { schemaId: { id: 'union-person' } } },
		'[unionPersonDefinition]',
		'SpruceSchemas.Core.IUnionPerson[]',
		'SpruceSchemas.Core.UnionPerson.IDefinition[]'
	)
	@test(
		'schemaIds',
		{
			isArray: false,
			options: { schemaIds: [{ id: 'union-person' }, { id: 'wrench' }] },
		},
		'[unionPersonDefinition, wrenchDefinition]',
		"{ schemaId: 'union-person', values: SpruceSchemas.Core.IUnionPerson } | { schemaId: 'wrench', values: SpruceSchemas.Core.IWrench }",
		'(SpruceSchemas.Core.UnionPerson.IDefinition | SpruceSchemas.Core.Wrench.IDefinition)[]'
	)
	@test(
		'schemaIds isArray',
		{
			isArray: true,
			options: { schemaIds: [{ id: 'union-person' }, { id: 'wrench' }] },
		},
		'[unionPersonDefinition, wrenchDefinition]',
		"({ schemaId: 'union-person', values: SpruceSchemas.Core.IUnionPerson } | { schemaId: 'wrench', values: SpruceSchemas.Core.IWrench })[]",
		'(SpruceSchemas.Core.UnionPerson.IDefinition | SpruceSchemas.Core.Wrench.IDefinition)[]'
	)
	protected static async testTemplateDetails(
		definition: ISchemaFieldDefinition,
		renderAsValue: string,
		renderAsType: string,
		renderAsDefinitionType: string
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
			renderAsDefinitionType,
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
