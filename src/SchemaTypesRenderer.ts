import { fieldClassMap, FieldDefinitions } from './fields'
import { Schema } from './schemas.static.types'
import { TemplateLanguage } from './types/template.types'
import assertOptions from './utilities/assertOptions'

export default class SchemaTypesRenderer {
    public static Renderer() {
        return new this()
    }

    public render(
        schema: Schema,
        options: {
            language: TemplateLanguage
        }
    ) {
        assertOptions({ schema, options }, ['schema', 'options'])

        const { id, fields } = schema

        const name = this.ucFirst(id)
        const comment = this.renderComment(schema)
        let body = ''

        for (const [key, field] of Object.entries(fields ?? {})) {
            let fieldLine = this.renderField(field, key)
            body += fieldLine
        }

        return `${comment ? `${comment}\n` : ''}type ${name} struct {
${body}}`
    }

    private renderField(field: FieldDefinitions, key: string) {
        const FieldClass = fieldClassMap[field.type]
        const { valueType, validation } = FieldClass.generateTemplateDetails({
            //@ts-ignore
            definition: field,
            language: 'go',
            importAs: 'SpruceSchema',
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

        if (minArrayLength !== undefined) {
            validateTags.push(`min=${minArrayLength}`)
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
            comment += `: ${schema.description}`
        }
        return comment
    }

    private ucFirst(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
}
