import { fieldClassMap, FieldDefinitions } from './fields'
import { Schema } from './schemas.static.types'
import {
    SchemaTemplateItem,
    TemplateLanguage,
    TemplateRenderAs,
} from './types/template.types'
import assertOptions from './utilities/assertOptions'

export default class SchemaTypesRenderer {
    public static Renderer() {
        return new this()
    }

    public render(
        schema: Schema,
        options: {
            language: TemplateLanguage
            schemaTemplateItems: SchemaTemplateItem[]
        }
    ) {
        assertOptions({ schema, options }, ['schema', 'options'])

        const { id, fields, namespace } = schema
        const { schemaTemplateItems } = options

        const name = this.renderName(id, namespace)
        const comment = this.renderComment(schema)
        let body = ''

        for (const [key, field] of Object.entries(fields ?? {})) {
            let fieldLine = this.renderField(field, key, schemaTemplateItems)
            body += fieldLine
        }

        return `${comment ? `${comment}\n` : ''}type ${name} struct {
${body}}`
    }

    private renderName(id: string, namespace?: string) {
        return `${namespace ? `${namespace}` : ''}${this.ucFirst(id)}`
    }

    private renderField(
        field: FieldDefinitions,
        key: string,
        schemaTemplateItems: SchemaTemplateItem[] = []
    ) {
        const FieldClass = fieldClassMap[field.type]
        const { valueType, validation } = FieldClass.generateTemplateDetails({
            //@ts-ignore
            definition: field,
            language: 'go',
            importAs: 'SpruceSchema',
            templateItems: schemaTemplateItems,
            renderAs: TemplateRenderAs.Type,
        })

        const { hint, isRequired, minArrayLength, isArray } = field

        let fieldLine = ''

        if (hint) {
            fieldLine += '\t// ' + hint + '\n'
        }

        fieldLine +=
            '\t' + this.ucFirst(key) + ' ' + valueType + ' `json:"' + key

        const validateTags: string[] = []

        if (isRequired) {
            validateTags.push('required')
        }

        if ((isArray && isRequired) || minArrayLength !== undefined) {
            validateTags.push(`min=${minArrayLength ?? 1}`)
        }

        if (!isRequired) {
            fieldLine += ',omitempty"'
        } else {
            fieldLine += '"'
        }

        if (validation && isArray) {
            validateTags.push('dive')
        }

        if (validation) {
            validateTags.push(...validation)
        }

        if (validateTags.length) {
            fieldLine += ' validate:"' + validateTags.join(',') + '"'
        }

        fieldLine += '`\n'
        return fieldLine
    }

    private renderComment(schema: Schema) {
        let comment = ''
        if (schema.name) {
            comment = `// ${schema.name}`
        }

        if (schema.description) {
            comment += `${schema.name ? ': ' : '// '}${schema.description}`
        }
        return comment
    }

    private ucFirst(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
}
