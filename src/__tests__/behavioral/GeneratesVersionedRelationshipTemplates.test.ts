import BaseTest, { test, assert } from '@sprucelabs/test'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import SchemaField from '../../fields/SchemaField'
import { ISchemaFieldDefinition } from '../../fields/SchemaField.types'
import {
	IFieldTemplateDetailOptions,
	ISchemaTemplateItem,
	TemplateRenderAs,
} from '../../types/template.types'
import buildSchema from '../../utilities/buildSchema'

export default class GeneratesRelationshipTemplatesTest extends BaseTest {
	private static wrenchV1Schema = buildSchema({
		id: 'wrench',
		name: 'Wrench',
		version: 'v1',
		fields: {
			wrenchSize: {
				type: FieldType.Number,
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
						GeneratesRelationshipTemplatesTest.wrenchV1Schema,
						GeneratesRelationshipTemplatesTest.wrenchV2Schema,
						GeneratesRelationshipTemplatesTest.screwdriverSchema,
					],
				},
			},
			tools: {
				type: FieldType.Schema,
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
	private static templateItems: ISchemaTemplateItem[] = [
		{
			namePascal: 'UnionPerson',
			nameCamel: 'unionPerson',
			nameReadable: 'Union person',
			namespace: 'Core',
			id: GeneratesRelationshipTemplatesTest.personSchema.id,
			schema: GeneratesRelationshipTemplatesTest.personSchema,
		},
		{
			namePascal: 'Wrench',
			nameCamel: 'wrench',
			nameReadable: 'Wrench',
			namespace: 'Core',
			id: GeneratesRelationshipTemplatesTest.wrenchV1Schema.id,
			schema: GeneratesRelationshipTemplatesTest.wrenchV1Schema,
		},
		{
			namePascal: 'Wrench',
			nameCamel: 'wrench',
			nameReadable: 'Wrench',
			namespace: 'Core',
			id: GeneratesRelationshipTemplatesTest.wrenchV2Schema.id,
			schema: GeneratesRelationshipTemplatesTest.wrenchV2Schema,
		},
		{
			namePascal: 'screwdriver',
			nameCamel: 'screwdriver',
			nameReadable: 'Screwdriver',
			namespace: 'Core',
			id: GeneratesRelationshipTemplatesTest.screwdriverSchema.id,
			schema: GeneratesRelationshipTemplatesTest.screwdriverSchema,
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
		"{ schemaId: 'union-person', values: SpruceSchemas.Core.IUnionPerson } | { schemaId: 'wrench', version: 'v2', values: SpruceSchemas.Core.v2.IWrench }",
		'(SpruceSchemas.Core.IUnionPersonSchema | SpruceSchemas.Core.v2.IWrenchSchema)[]'
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
		"({ schemaId: 'union-person', values: SpruceSchemas.Core.IUnionPerson } | { schemaId: 'wrench', version: 'v1', values: SpruceSchemas.Core.v1.IWrench })[]",
		'(SpruceSchemas.Core.IUnionPersonSchema | SpruceSchemas.Core.v1.IWrenchSchema)[]'
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

	@test('missing version non array value', {
		isArray: false,
		options: { schemaIds: [{ id: 'union-person' }, { id: 'wrench' }] },
	})
	@test('missing version array value', {
		isArray: true,
		options: { schemaId: { id: 'wrench' } },
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
				type: FieldType.Schema,
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
