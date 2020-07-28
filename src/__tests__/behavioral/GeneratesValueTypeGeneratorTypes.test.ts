import BaseTest, { test, assert } from '@sprucelabs/test'
import { FieldDefinition } from '#spruce/schemas/fields/fields.types'
import FieldType from '#spruce/schemas/fields/fieldTypeEnum'
import {
	IFieldDefinition,
	BooleanField,
	SelectField,
	SchemaField,
} from '../../fields'
import AbstractField from '../../fields/AbstractField'
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
			type: {
				type: FieldType.Select,
				options: {
					choices: [
						{ value: 'phillips', label: 'Phillips' },
						{ value: 'flathead', label: 'Flathead' },
					],
				},
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
		'Boolean field',
		GeneratesRelationshipTemplatesTest.screwdriverDefinition.fields.isFlathead,
		BooleanField,
		undefined
	)
	@test(
		'Select field',
		GeneratesRelationshipTemplatesTest.wrenchDefinition.fields.type,
		SelectField,
		'SelectValueTypeGenerator'
	)
	@test(
		'Schema field',
		GeneratesRelationshipTemplatesTest.personDefinition.fields.favoriteTool,
		SchemaField,
		'SchemaFieldValueTypeGenerator<F extends ISchemaFieldDefinition? F : ISchemaFieldDefinition, CreateSchemaInstances>'
	)
	protected static async testValueGeneratorType(
		definition: IFieldDefinition,
		Field: typeof AbstractField,
		expected: string | undefined
	) {
		const templateOptions: IFieldTemplateDetailOptions<FieldDefinition> = {
			language: 'ts',
			globalNamespace: 'SpruceSchemas',
			importAs: 'generated_test',
			templateItems: GeneratesRelationshipTemplatesTest.templateItems,
			// @ts-ignore
			definition: {
				...definition,
				type: FieldType.Schema,
			},
			renderAs: TemplateRenderAs.Type, // is overwritten below
		}

		const rendersAs = Object.values(TemplateRenderAs)

		rendersAs.forEach((renderAs) => {
			const options = {
				...templateOptions,
				renderAs,
			}
			const { valueTypeGeneratorType } = Field.generateTemplateDetails(options)

			assert.isEqual(valueTypeGeneratorType, expected)
		})
	}
}
