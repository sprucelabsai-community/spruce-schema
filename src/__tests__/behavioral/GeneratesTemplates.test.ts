import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import { RawField, SelectField } from '../../fields'
import { FieldDefinition } from '../../fields/field.static.types'
import ImageField from '../../fields/ImageField'
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
        '("one" | "two")[]'
    )
    @test(
        'select isArray with numbers',
        SelectField,
        {
            type: 'select',
            isArray: true,
            options: {
                choices: [
                    { value: 0, label: 'One' },
                    { value: 1, label: 'Two' },
                ],
            },
        },
        '(0 | 1)[]'
    )
    @test(
        'image',
        ImageField,
        {
            type: 'image',
            options: {
                requiredSizes: [],
            },
        },
        'generated_test.ImageFieldValue'
    )
    @test(
        'image',
        ImageField,
        {
            type: 'image',
            options: {
                requiredSizes: [],
            },
        },
        'taco.ImageFieldValue',
        'taco'
    )
    @test(
        'raw array',
        RawField,
        {
            type: 'raw',
            isArray: true,
            options: {
                valueType: 'Record<string, any>',
            },
        },
        'Record<string, any>[]'
    )
    protected static async testTemplateDetails(
        Field: any,
        definition: FieldDefinition,
        renderAsValue: string,
        importAs = 'generated_test'
    ) {
        const templateOptions: FieldTemplateDetailOptions<any> = {
            language: 'ts',
            globalNamespace: 'SpruceSchemas',
            importAs,
            templateItems: [],
            definition: {
                ...definition,
            },
            renderAs: TemplateRenderAs.Type, // is overwritten below
        }

        const expected = {
            renderAsValue,
            renderAsType: renderAsValue,
            renderAsSchemaType: renderAsValue,
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
