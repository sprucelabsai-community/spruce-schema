import fs from 'fs'
import path from 'path'
import { test, suite, assert, errorAssert } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../../AbstractSchemaTest'
import { Schema } from '../../../schemas.static.types'
import SchemaTypesRenderer from '../../../SchemaTypesRenderer'

@suite()
export default class GoStructsTest extends AbstractSchemaTest {
    private renderer: SchemaTypesRenderer = SchemaTypesRenderer.Renderer()
    protected async beforeEach(): Promise<void> {
        await super.beforeEach()
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
        const casesDir = this.resolvePath(
            'build/__tests__/behavioral/renderingTypes/cases'
        )

        const schemaFiles = fs
            .readdirSync(casesDir)
            .filter((file) => file.endsWith('.schema.js'))
            .sort()

        assert.isAbove(
            schemaFiles.length,
            0,
            'Expected at least one schema fixture.'
        )

        for (const schemaFile of schemaFiles) {
            const schemaModule = await import(`./cases/${schemaFile}`)
            const schema: Schema | undefined = schemaModule?.default

            assert.isTruthy(
                schema,
                `Fixture ${schemaFile} did not default export a schema.`
            )

            const expectedFile = `${this.pascalCase(schema.id)}.go`
            const expectedPath = path.join(casesDir, expectedFile)

            assert.isTrue(
                fs.existsSync(expectedPath),
                `Missing rendered Go file for fixture ${schemaFile} (expected ${expectedFile}).`
            )

            this.assertRenderMatchesSource(schema, expectedFile, schema.id)
        }
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
            `Case ${caseId} did not render expected go.`
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
        const expected = source.replace('package cases\n\n', '').trim()
        return expected
    }

    private render(schema: Schema) {
        return this.renderer.render(schema, {
            language: 'go',
        })
    }

    private normalizeGo(source: string) {
        return source
            .replace(/[ \t]+/g, ' ')
            .replace(/ ?\n/g, '\n')
            .trim()
    }

    private pascalCase(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1)
    }
}
