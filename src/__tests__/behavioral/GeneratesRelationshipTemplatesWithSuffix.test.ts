import { test, assert } from '@sprucelabs/test'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import { SchemaField, SchemaFieldFieldDefinition } from '../../fields'
import {
	FieldTemplateDetailOptions,
	SchemaTemplateItem,
	TemplateRenderAs,
} from '../../types/template.types'
import buildSchema from '../../utilities/buildSchema'

const wrenchSchema = buildSchema({
	id: 'wrench',
	name: 'Wrench',
	typeSuffix: '<T = any>',
	fields: {
		wrenchSizeType: {
			type: 'raw',
			options: {
				valueType: 'T',
			},
		},
	},
})

const screwdriverSchema = buildSchema({
	id: 'screwdriver',
	name: 'Screwdriver',
	typeSuffix: '<T = any>',
	fields: {
		isFlatheadType: {
			type: 'raw',
			options: {
				valueType: 'T',
			},
		},
		screwdriverLength: {
			type: 'number',
			label: 'Length',
		},
	},
})

const personSchema = buildSchema({
	id: 'union-person',
	name: 'Union Person',
	typeSuffix: '<T = any>',
	fields: {
		favoriteTool: {
			type: 'schema',
			options: {
				typeSuffix: '<T>',
				schemas: [wrenchSchema, screwdriverSchema],
			},
		},
		tools: {
			type: 'schema',
			isArray: true,
			options: {
				typeSuffix: '<T>',
				schemas: [wrenchSchema, screwdriverSchema],
			},
		},
	},
})

const templateItems: SchemaTemplateItem[] = [
	{
		namePascal: 'UnionPerson',
		nameCamel: 'unionPerson',
		nameReadable: 'Union person',
		namespace: 'Core',
		id: personSchema.id,
		schema: personSchema,
		destinationDir: '#spruce/schemas',
	},
	{
		namePascal: 'Wrench',
		nameCamel: 'wrench',
		nameReadable: 'Wrench',
		namespace: 'Core',
		id: wrenchSchema.id,
		schema: wrenchSchema,
		destinationDir: '#spruce/schemas',
	},
	{
		namePascal: 'Screwdriver',
		nameCamel: 'screwdriver',
		nameReadable: 'Screwdriver',
		namespace: 'Core',
		id: screwdriverSchema.id,
		schema: screwdriverSchema,
		destinationDir: '#spruce/schemas',
	},
]

export default class GeneratesRelationshipTemplatesWithSuffixTest extends AbstractSchemaTest {
	@test(
		'schemaId isArray',
		{
			isArray: true,
			options: { typeSuffix: '<T>', schemaId: { id: 'union-person' } },
		},
		'unionPersonSchema',
		'SpruceSchemas.Core.UnionPerson<T>[]',
		'SpruceSchemas.Core.UnionPersonSchema'
	)
	@test(
		'schemaId notArray',
		{
			isArray: false,
			options: { typeSuffix: '<T>', schemaId: { id: 'union-person' } },
		},
		'unionPersonSchema',
		'SpruceSchemas.Core.UnionPerson<T>',
		'SpruceSchemas.Core.UnionPersonSchema'
	)
	@test(
		'schemaId isArray union',
		{
			isArray: false,
			options: {
				typeSuffix: '<T>',
				schemaIds: [{ id: 'screwdriver' }, { id: 'wrench' }],
			},
		},
		'[screwdriverSchema, wrenchSchema]',
		"{ schemaId: 'screwdriver', values: SpruceSchemas.Core.Screwdriver<T> } | { schemaId: 'wrench', values: SpruceSchemas.Core.Wrench<T> }",
		'(SpruceSchemas.Core.ScrewdriverSchema | SpruceSchemas.Core.WrenchSchema)[]'
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
			templateItems,
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
