import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { SelectField } from '../../fields'
import { FieldDefinition } from '../../fields/field.static.types'
import {
	FieldTemplateDetailOptions,
	TemplateRenderAs,
} from '../../types/template.types'

export default class GeneratesTemplatesTest extends AbstractSpruceTest {
	@test(
		'select',
		SelectField,
		{
			type: 'select',
			options: {
				choices: [
					{ value: 'one', label: 'One' },
					{ value: 'two', label: 'Two' },
				],
			},
		},
		'("one" | "two")',
		'("one" | "two")',
		'("one" | "two")'
	)
	@test(
		'select isArray',
		SelectField,
		{
			type: 'select',
			isArray: true,
			options: {
				choices: [
					{ value: 'one', label: 'One' },
					{ value: 'two', label: 'Two' },
				],
			},
		},
		'("one" | "two")[]',
		'("one" | "two")[]',
		'("one" | "two")[]'
	)
	protected static async testTemplateDetails(
		Field: any,
		definition: FieldDefinition,
		renderAsValue: string,
		renderAsType: string,
		renderAsSchemaType: string
	) {
		const templateOptions: FieldTemplateDetailOptions<any> = {
			language: 'ts',
			globalNamespace: 'SpruceSchemas',
			importAs: 'generated_test',
			templateItems: [],
			definition: {
				...definition,
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
			const { valueType } = Field.generateTemplateDetails(options)
			const exp = expected[`renderAs${renderAs}` as keyof typeof expected]

			assert.isEqual(valueType, exp)
		})
	}
}
