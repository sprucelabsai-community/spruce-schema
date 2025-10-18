import fs from 'fs'
import path from 'path'
import {
    test,
    suite,
    assert,
    errorAssert,
    generateId,
} from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../../AbstractSchemaTest'
import { Schema } from '../../../schemas.static.types'
import SchemaTypesRenderer from '../../../SchemaTypesRenderer'
import { SchemaTemplateItem } from '../../../types/template.types'
import buildSchema from '../../../utilities/buildSchema'

@suite()
export default class GoStructsTest extends AbstractSchemaTest {
    private renderer: SchemaTypesRenderer = SchemaTypesRenderer.Renderer()
    private casesDir!: string
    private schemaTemplateItems: SchemaTemplateItem[] = []

    protected async beforeEach(): Promise<void> {
        await super.beforeEach()
        this.casesDir = this.resolvePath(
            'build/__tests__/behavioral/renderingTypes/cases'
        )

        this.pushTemplateItem(friendSchema)
        this.pushTemplateItem(personWithFriendSchema)
    }

    @test()
    protected async throwsWithMissing() {
        //@ts-ignore
        const err = assert.doesThrow(() => this.renderer.render())
        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['schema', 'options'],
        })
    }

    @test()
    protected async rendersAllCasesFromFixtures() {
        const schemaFiles = this.loadSchemaFiles()

        for (const schemaFile of schemaFiles) {
            const schema = await this.importSchema(schemaFile)
            this.assertRendersStructForSchema(schema)
        }
    }

    @test()
    protected async canRenderNestedSchemas() {
        this.assertRendersStructForSchema(personWithFriendSchema)
    }

    private assertRendersStructForSchema(schema: Schema) {
        const expectedFile = `${this.pascalCase(schema.id)}.go`
        const expectedPath = path.join(this.casesDir, expectedFile)

        assert.isTrue(
            fs.existsSync(expectedPath),
            `Missing rendered Go file for fixture ${schema.id}.schema.js (expected ${expectedFile}).`
        )

        this.assertRenderMatchesSource(schema, expectedFile, schema.id)
    }

    private async importSchema(schemaFile: string) {
        const schemaModule = await import(`./cases/${schemaFile}`)
        const schema: Schema | undefined = schemaModule?.default

        assert.isTruthy(
            schema,
            `Fixture ${schemaFile} did not default export a schema.`
        )
        return schema
    }

    private loadSchemaFiles() {
        const schemaFiles = fs
            .readdirSync(this.casesDir)
            .filter((file) => file.endsWith('.schema.js'))
            .sort()

        assert.isAbove(
            schemaFiles.length,
            0,
            'Expected at least one schema fixture.'
        )
        return schemaFiles
    }

    private assertSchemaRendersAs(
        schema: Schema,
        expected: string,
        caseId: string
    ) {
        const results = this.render(schema)
        const normalizedResults = this.normalizeGo(results)
        const normalizedExpected = this.normalizeGo(expected)
        assert.isEqual(
            normalizedResults,
            normalizedExpected,
            `${toPascalCase(caseId)}.go did not render expected go.`
        )
    }

    private assertRenderMatchesSource(
        schema: Schema,
        file: string,
        caseId: string
    ) {
        const expected = this.readGoSource(file)
        this.assertSchemaRendersAs(schema, expected, caseId)
    }

    private readGoSource(file: string) {
        const expectedFile = this.resolvePath(
            `src/__tests__/behavioral/renderingTypes/cases/${file}`
        )

        const source = fs.readFileSync(expectedFile).toString()
        const withoutPackage = source.replace(/^package cases\s*\n/, '')
        const lines = withoutPackage.split('\n')
        const filtered: string[] = []
        let skippingImportBlock = false

        for (const line of lines) {
            const trimmed = line.trim()

            if (!skippingImportBlock && trimmed.startsWith('import')) {
                if (trimmed === 'import(' || trimmed === 'import (') {
                    skippingImportBlock = true
                }
                continue
            }

            if (skippingImportBlock) {
                if (trimmed === ')') {
                    skippingImportBlock = false
                }
                continue
            }

            filtered.push(line)
        }

        const expected = filtered.join('\n').trim()
        return expected
    }

    private render(schema: Schema) {
        return this.renderer.render(schema, {
            language: 'go',
            schemaTemplateItems: this.schemaTemplateItems,
        })
    }

    private normalizeGo(source: string) {
        const parts = source.split(`// split here`)
        const cleaned = parts[0]
            .replace(/[ \t]+/g, ' ')
            .replace(/ ?\n/g, '\n')
            .trim()

        return cleaned
    }

    private pascalCase(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }

    private pushTemplateItem(schema: Schema) {
        this.schemaTemplateItems.push({
            id: schema.id,
            nameCamel: schema.id,
            namePascal: toPascalCase(schema.id),
            nameReadable: schema.id,
            namespace: 'Spruce',
            schema,
            destinationDir: this.resolvePath(generateId()),
        })
    }
}

function toPascalCase(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

const friendSchema = buildSchema({
    id: 'friend',
    namespace: 'Spruce',
    fields: {
        name: {
            type: 'text',
        },
    },
})

const personWithFriendSchema = buildSchema({
    id: 'personWithFriend',
    namespace: 'Spruce',
    fields: {
        name: {
            type: 'text',
        },
        friend: {
            type: 'schema',
            options: {
                schema: friendSchema,
            },
        },
        friends: {
            type: 'schema',
            isArray: true,
            options: {
                schema: friendSchema,
            },
        },
    },
})
