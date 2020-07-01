import BaseTest, { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import SchemaField, { ISchemaFieldDefinition } from '../../fields/SchemaField'
import {
	IFieldTemplateDetailOptions,
	ISchemaTemplateItem,
	TemplateRenderAs
} from '../../template.types'
import buildSchemaDefinition from '../../utilities/buildSchemaDefinition'

export default class GeneratesRelationshipTemplatesTest extends BaseTest {
	private static wrenchV1Definition = buildSchemaDefinition({
		id: 'wrench',
		name: 'Wrench',
		version: 'v1',
		fields: {
			wrenchSize: {
				type: FieldType.Number,
				label: 'Size'
			}
		}
	})

	private static wrenchV2Definition = buildSchemaDefinition({
		id: 'wrench',
		name: 'Wrench',
		version: 'v2',
		fields: {
			wrenchSize: {
				type: FieldType.Number,
				label: 'Size'
			}
		}
	})

	private static screwdriverDefinition = buildSchemaDefinition({
		id: 'screwdriver',
		name: 'Screwdriver',
		fields: {
			isFlathead: {
				type: FieldType.Boolean
			},
			screwdriverLength: {
				type: FieldType.Number,
				label: 'Length'
			}
		}
	})

	private static personDefinition = buildSchemaDefinition({
		id: 'union-person',
		name: 'Union Person',
		fields: {
			favoriteTool: {
				type: FieldType.Schema,
				options: {
					schemas: [
						GeneratesRelationshipTemplatesTest.wrenchV1Definition,
						GeneratesRelationshipTemplatesTest.wrenchV2Definition,
						GeneratesRelationshipTemplatesTest.screwdriverDefinition
					]
				}
			},
			tools: {
				type: FieldType.Schema,
				isArray: true,
				options: {
					schemas: [
						GeneratesRelationshipTemplatesTest.wrenchV1Definition,
						GeneratesRelationshipTemplatesTest.wrenchV2Definition,
						GeneratesRelationshipTemplatesTest.screwdriverDefinition
					]
				}
			}
		}
	})

	// the global template items[]
	private static templateItems: ISchemaTemplateItem[] = [
		{
			namePascal: 'UnionPerson',
			nameCamel: 'unionPerson',
			nameReadable: 'Union person',
			namespace: 'Core',
			id: GeneratesRelationshipTemplatesTest.personDefinition.id,
			definition: GeneratesRelationshipTemplatesTest.personDefinition
		},
		{
			namePascal: 'Wrench',
			nameCamel: 'wrench',
			nameReadable: 'Wrench',
			namespace: 'Core',
			id: GeneratesRelationshipTemplatesTest.wrenchV1Definition.id,
			definition: GeneratesRelationshipTemplatesTest.wrenchV1Definition
		},
		{
			namePascal: 'Wrench',
			nameCamel: 'wrench',
			nameReadable: 'Wrench',
			namespace: 'Core',
			id: GeneratesRelationshipTemplatesTest.wrenchV2Definition.id,
			definition: GeneratesRelationshipTemplatesTest.wrenchV2Definition
		},
		{
			namePascal: 'screwdriver',
			nameCamel: 'screwdriver',
			nameReadable: 'Screwdriver',
			namespace: 'Core',
			id: GeneratesRelationshipTemplatesTest.screwdriverDefinition.id,
			definition: GeneratesRelationshipTemplatesTest.screwdriverDefinition
		}
	]

	@test(
		'single value',
		{
			isArray: false,
			options: {
				schemaIds: [{ id: 'union-person' }, { id: 'wrench', version: 'v2' }]
			}
		},
		'[unionPersonDefinitionCore, wrenchDefinitionCore]',
		"{ schemaId: 'union-person', values: SpruceSchemas.Core.IUnionPerson } | { schemaId: 'wrench', version: 'v2', values: SpruceSchemas.Core.v2.IWrench }",
		'(SpruceSchemas.Core.UnionPerson.IDefinition | SpruceSchemas.Core.v2.Wrench.IDefinition)[]'
	)
	@test(
		'is array',
		{
			isArray: true,
			options: {
				schemaIds: [{ id: 'union-person' }, { id: 'wrench', version: 'v1' }]
			}
		},
		'[unionPersonDefinitionCore, wrenchDefinitionCore]',
		"({ schemaId: 'union-person', values: SpruceSchemas.Core.IUnionPerson } | { schemaId: 'wrench', version: 'v1', values: SpruceSchemas.Core.v1.IWrench })[]",
		'(SpruceSchemas.Core.UnionPerson.IDefinition | SpruceSchemas.Core.v1.Wrench.IDefinition)[]'
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
				type: FieldType.Schema
			},
			renderAs: TemplateRenderAs.Type // is overwritten below
		}

		const expected = {
			renderAsValue,
			renderAsType,
			renderAsDefinitionType
		}

		const rendersAs = Object.getOwnPropertyNames(TemplateRenderAs)

		rendersAs.forEach(renderAs => {
			const options = {
				...templateOptions,
				// @ts-ignore
				renderAs: TemplateRenderAs[renderAs]
			}
			const { valueType } = SchemaField.generateTemplateDetails(options)
			const exp = expected[`renderAs${renderAs}` as keyof typeof expected]

			assert.isEqual(valueType, exp)
		})
	}

	@test('missing version non array value', {
		isArray: false,
		options: { schemaIds: [{ id: 'union-person' }, { id: 'wrench' }] }
	})
	@test('missing version array value', {
		isArray: true,
		options: { schemaId: { id: 'wrench' } }
	})
	protected static async throwsMissingVersion(
		definition: ISchemaFieldDefinition
	) {
		const templateOptions: IFieldTemplateDetailOptions<ISchemaFieldDefinition> = {
			language: 'ts',
			globalNamespace: 'SpruceSchemas',
			importAs: 'generated_test',
			templateItems: GeneratesRelationshipTemplatesTest.templateItems,
			definition: {
				...definition,
				type: FieldType.Schema
			},
			renderAs: TemplateRenderAs.Type // is overwritten below
		}

		const rendersAs = Object.getOwnPropertyNames(TemplateRenderAs)

		await Promise.all(
			rendersAs.map(async renderAs => {
				const options = {
					...templateOptions,
					// @ts-ignore
					renderAs: TemplateRenderAs[renderAs]
				}

				assert.doesThrow(
					() => SchemaField.generateTemplateDetails(options),
					/VERSION/
				)
			})
		)
	}
}
