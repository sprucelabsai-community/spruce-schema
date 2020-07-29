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
import buildSchema from '../../utilities/buildSchema'

export default class GeneratesRelationshipTemplatesTest extends BaseTest {
	private static wrenchSchema = buildSchema({
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
		},
		{
			namePascal: 'Wrench',
			nameCamel: 'wrench',
			nameReadable: 'Wrench',
			namespace: 'Core',
			id: GeneratesRelationshipTemplatesTest.wrenchSchema.id,
			schema: GeneratesRelationshipTemplatesTest.wrenchSchema,
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
		'Boolean field',
		GeneratesRelationshipTemplatesTest.screwdriverSchema.fields.isFlathead,
		BooleanField,
		undefined
	)
	@test(
		'Select field',
		GeneratesRelationshipTemplatesTest.wrenchSchema.fields.type,
		SelectField,
		'SelectValueTypeGenerator'
	)
	@test(
		'Schema field',
		GeneratesRelationshipTemplatesTest.personSchema.fields.favoriteTool,
		SchemaField,
		'SchemaFieldValueTypeGenerator<F extends ISchemaFieldDefinition? F : ISchemaFieldDefinition, CreateEntityInstances>'
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
