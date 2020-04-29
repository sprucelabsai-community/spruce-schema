import BaseTest, { test, ISpruce, assert } from '@sprucelabs/test'
import buildSchemaDefinition from './utilities/buildSchemaDefinition'
import { FieldType } from '#spruce:schema/fields/fieldType'
import { default as Schema } from './Schema'
import {
	FieldNamesWithDefaultValueSet,
	ISchemaDefinition,
	SchemaDefinitionDefaultValues
} from './schema.types'

Schema.enableDuplicateCheckWhenTracking = false

interface IWrenchDefinition {
	id: 'wrench'
	name: 'Wrench'
	fields: {
		wrenchSize: {
			type: FieldType.Number
			label: 'Size'
			defaultValue: 10
		}
		tags: {
			type: FieldType.Text
			label: 'Tags'
			isArray: true
			defaultValue: ['low', 'tough', 'tool']
		}
		color: {
			type: FieldType.Text
			label: 'Color (w/ no default)'
		}
	}
}

interface IScrewdriverDefinition {
	id: 'screwdriver'
	name: 'Screwdriver'
	fields: {
		type: {
			type: FieldType.Select
			defaultValue: 'flathead'
			options: {
				choices: [
					{ value: 'flathead'; label: 'Flathead' },
					{ value: 'screwdriver'; label: 'Screwdriver' }
				]
			}
		}
		screwdriverLength: {
			type: FieldType.Number
			label: 'Length'
		}
	}
}

type IScrewdriverDefinitionDefaultValues = SchemaDefinitionDefaultValues<
	IScrewdriverDefinition
>

interface IScrewdriverDefinitionExpectedDefaultValues {
	type: string
}

interface IUnionPersonDefinition {
	id: 'union-person'
	name: 'Union Person'
	fields: {
		favoriteTool: {
			type: FieldType.Schema
			options: {
				schemas: [IWrenchDefinition, IScrewdriverDefinition]
			}
			defaultValue: { schemaId: 'wrench'; values: { wrenchSize: 100 } }
		}
		leastFavoriteTool: {
			type: FieldType.Schema
			options: {
				schemas: [IWrenchDefinition, IScrewdriverDefinition]
			}
			defaultValue: { schemaId: 'screwdriver'; values: { type: 'flathead' } }
		}
		tools: {
			type: FieldType.Schema
			isArray: true
			defaultValue: [
				{
					schemaId: 'screwdriver'
					values: { screwdriverLength: 22 }
				}
			]
			options: {
				schemas: [IWrenchDefinition, IScrewdriverDefinition]
			}
		}
	}
}

export default class SchemaDefaultValuesTest extends BaseTest {
	private static wrenchDefinition = buildSchemaDefinition<IWrenchDefinition>({
		id: 'wrench',
		name: 'Wrench',
		fields: {
			wrenchSize: {
				type: FieldType.Number,
				label: 'Size',
				defaultValue: 10
			},
			tags: {
				type: FieldType.Text,
				label: 'Tags',
				isArray: true,
				defaultValue: ['low', 'tough', 'tool']
			},
			color: {
				type: FieldType.Text,
				label: 'Color (w/ no default)'
			}
		}
	})

	private static screwdriverDefinition = buildSchemaDefinition<
		IScrewdriverDefinition
	>({
		id: 'screwdriver',
		name: 'Screwdriver',
		fields: {
			type: {
				type: FieldType.Select,
				defaultValue: 'flathead',
				options: {
					choices: [
						{ value: 'flathead', label: 'Flathead' },
						{ value: 'screwdriver', label: 'Screwdriver' }
					]
				}
			},
			screwdriverLength: {
				type: FieldType.Number,
				label: 'Length'
			}
		}
	})

	private static personDefinition = buildSchemaDefinition<
		IUnionPersonDefinition
	>({
		id: 'union-person',
		name: 'Union Person',
		fields: {
			favoriteTool: {
				type: FieldType.Schema,
				options: {
					schemas: [
						SchemaDefaultValuesTest.wrenchDefinition,
						SchemaDefaultValuesTest.screwdriverDefinition
					]
				},
				defaultValue: { schemaId: 'wrench', values: { wrenchSize: 100 } }
			},
			leastFavoriteTool: {
				type: FieldType.Schema,
				options: {
					schemas: [
						SchemaDefaultValuesTest.wrenchDefinition,
						SchemaDefaultValuesTest.screwdriverDefinition
					]
				},
				defaultValue: { schemaId: 'screwdriver', values: { type: 'flathead' } }
			},
			tools: {
				type: FieldType.Schema,
				isArray: true,
				defaultValue: [
					{
						schemaId: 'screwdriver',
						values: { screwdriverLength: 22 }
					}
				],
				options: {
					schemas: [
						SchemaDefaultValuesTest.wrenchDefinition,
						SchemaDefaultValuesTest.screwdriverDefinition
					]
				}
			}
		}
	})

	@test(
		'Test typing on default values with text and select fields (test will always pass, lint will fail)'
	)
	protected static textAndSelectDefaultValues() {
		let fieldName:
			| FieldNamesWithDefaultValueSet<
					typeof SchemaDefaultValuesTest.wrenchDefinition
			  >
			| undefined

		// make sure types are 100% (only works if they are currently undefined)
		assert.expectType<'wrenchSize' | 'tags' | undefined>(fieldName)
	}

	@test(
		'Typing on default values with schema fields (test will pass, lint will fail)'
	)
	protected static schemaFieldsDefaultValues() {
		let fieldName:
			| FieldNamesWithDefaultValueSet<
					typeof SchemaDefaultValuesTest.personDefinition
			  >
			| undefined

		// make sure types are 100% (only works if they are currently undefined)
		assert.expectType<
			'favoriteTool' | 'leastFavoriteTool' | 'tools' | undefined
		>(fieldName)
	}

	@test(
		'Can get default values number and text array',
		SchemaDefaultValuesTest.wrenchDefinition,
		{
			wrenchSize: 10,
			tags: ['low', 'tough', 'tool']
		}
	)
	@test(
		'Can get default values choices',
		SchemaDefaultValuesTest.screwdriverDefinition,
		{
			type: 'flathead'
		}
	)
	protected static defaultValueTests(
		s: ISpruce,
		definition: ISchemaDefinition,
		expectedDefaultValues: Record<string, any>
	) {
		const schema = new Schema(definition)
		const defaultValues = schema.getDefaultValues()
		assert.deepEqual(defaultValues, expectedDefaultValues)
	}

	@test('Can get default values for union fields')
	protected static defaultSchemaValueTests() {
		const schema = new Schema(SchemaDefaultValuesTest.personDefinition)
		const { favoriteTool, leastFavoriteTool, tools } = schema.getDefaultValues()

		assert.isFunction(favoriteTool.get)
		assert.isFunction(leastFavoriteTool.get)
		assert.equal(tools.length, 1)

		assert.equal(
			favoriteTool.schemaId === 'wrench' && favoriteTool.get('wrenchSize'),
			100
		)

		assert.equal(
			tools[0] &&
				tools[0].schemaId === 'screwdriver' &&
				tools[0].get('screwdriverLength'),
			22
		)

		// assert.deepEqual(defaultValues, {})
	}

	@test('Creates types that work as expected')
	protected static defaultTypesTests(
		dummy: IScrewdriverDefinitionDefaultValues
	) {
		const expected = {
			wrenchSize: 12,
			tags: ['low', 'tough', 'tool']
		}

		assert.expectType<SchemaDefinitionDefaultValues<IWrenchDefinition>>(
			expected
		)

		dummy.type

		assert.expectType<IScrewdriverDefinitionExpectedDefaultValues>(dummy)
	}
}
