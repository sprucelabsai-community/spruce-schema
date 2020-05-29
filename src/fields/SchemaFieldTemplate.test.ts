import BaseTest, { test, assert, ISpruce } from '@sprucelabs/test'
import buildSchemaDefinition from '../utilities/buildSchemaDefinition'
import { FieldType } from '#spruce:schema/fields/fieldType'
import SchemaField, { ISchemaFieldDefinition } from './SchemaField'
import {
	IFieldTemplateDetailOptions,
	ISchemaTemplateItem,
	TemplateRenderAs
} from '../template.types'

export default class SchemaFieldTemplateTest extends BaseTest {
	private static wrenchDefinition = buildSchemaDefinition({
		id: 'wrench',
		name: 'Wrench',
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
						SchemaFieldTemplateTest.wrenchDefinition,
						SchemaFieldTemplateTest.screwdriverDefinition
					]
				}
			},
			tools: {
				type: FieldType.Schema,
				isArray: true,
				options: {
					schemas: [
						SchemaFieldTemplateTest.wrenchDefinition,
						SchemaFieldTemplateTest.screwdriverDefinition
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
			id: SchemaFieldTemplateTest.personDefinition.id,
			definition: SchemaFieldTemplateTest.personDefinition
		},
		{
			namePascal: 'Wrench',
			nameCamel: 'wrench',
			nameReadable: 'Wrench',
			namespace: 'Core',
			id: SchemaFieldTemplateTest.wrenchDefinition.id,
			definition: SchemaFieldTemplateTest.wrenchDefinition
		},
		{
			namePascal: 'screwdriver',
			nameCamel: 'screwdriver',
			nameReadable: 'Screwdriver',
			namespace: 'Core',
			id: SchemaFieldTemplateTest.screwdriverDefinition.id,
			definition: SchemaFieldTemplateTest.screwdriverDefinition
		}
	]

	@test(
		'schemaId',
		{ isArray: false, options: { schemaId: 'union-person' } },
		'[unionPersonDefinitionCore]',
		'SpruceSchemas.Core.IUnionPerson',
		'SpruceSchemas.Core.UnionPerson.IDefinition[]'
	)
	@test(
		'schemaId isArray',
		{ isArray: true, options: { schemaId: 'union-person' } },
		'[unionPersonDefinitionCore]',
		'SpruceSchemas.Core.IUnionPerson[]',
		'SpruceSchemas.Core.UnionPerson.IDefinition[]'
	)
	@test(
		'schemaIds',
		{ isArray: false, options: { schemaIds: ['union-person', 'wrench'] } },
		'[unionPersonDefinitionCore, wrenchDefinitionCore]',
		"{ schemaId: 'union-person', values: SpruceSchemas.Core.IUnionPerson } | { schemaId: 'wrench', values: SpruceSchemas.Core.IWrench }",
		'(SpruceSchemas.Core.UnionPerson.IDefinition | SpruceSchemas.Core.Wrench.IDefinition)[]'
	)
	@test(
		'schemaIds isArray',
		{ isArray: true, options: { schemaIds: ['union-person', 'wrench'] } },
		'[unionPersonDefinitionCore, wrenchDefinitionCore]',
		"({ schemaId: 'union-person', values: SpruceSchemas.Core.IUnionPerson } | { schemaId: 'wrench', values: SpruceSchemas.Core.IWrench })[]",
		'(SpruceSchemas.Core.UnionPerson.IDefinition | SpruceSchemas.Core.Wrench.IDefinition)[]'
	)
	protected static async testTemplateDetails(
		_: ISpruce,
		definition: ISchemaFieldDefinition,
		renderAsValue: string,
		renderAsType: string,
		renderAsDefinitionType: string
	) {
		const templateOptions: IFieldTemplateDetailOptions<ISchemaFieldDefinition> = {
			language: 'ts',
			globalNamespace: 'SpruceSchemas',
			importAs: 'generated_test',
			templateItems: SchemaFieldTemplateTest.templateItems,
			definition: {
				type: FieldType.Schema,
				...definition
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
			const { valueType } = SchemaField.templateDetails(options)
			const exp = expected[`renderAs${renderAs}` as keyof typeof expected]

			assert.equal(valueType, exp)
		})
	}
}
