import { test, assert } from '@sprucelabs/test-utils'
import { errorAssert } from '@sprucelabs/test-utils'
import AbstractSchemaTest from '../../AbstractSchemaTest'
import assertOptions from '../../utilities/assertOptions'

export default class AssertingOptionsTest extends AbstractSchemaTest {
    private static optionalField: string | undefined = 'test'
    @test()
    protected static throwsWhenNotFound() {
        //@ts-ignore
        assert.doesThrow(() => assertOptions({}, ['hello']))
    }

    @test()
    protected static passeWithZero() {
        assertOptions({ hello: 0 }, ['hello'])
    }

    @test()
    protected static failsWithNull() {
        assert.doesThrow(() => assertOptions({ hello: null }, ['hello']))
    }

    @test('can pass through message 1', 'what the')
    @test('can pass through message 2', 'so much more')
    protected static passesThroughErrorMessage(msg: string) {
        //@ts-ignore
        assert.doesThrow(() => assertOptions({}, ['waka'], msg), msg)
    }

    @test()
    protected static typesResultsAsNonNullable<
        Context extends Record<string, any> = Record<string, any>,
    >() {
        interface TestOptions<
            Context extends Record<string, any> = Record<string, any>,
        > {
            passed?: boolean
            stillOptional?: boolean
            context: Partial<Context>
            nested?: {
                hey?: string
                deep?: TestOptions<Context>
                test?: TestClass1
                context?: Partial<Context>
            }
        }

        const options: TestOptions<Context> = {
            passed: true,
            stillOptional: false,
            context: {},
            nested: {
                hey: 'true',
            },
        }

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { passed, stillOptional } = assertOptions(options, [
            'passed',
            'nested.hey',
        ])

        assert.isExactType<boolean, typeof passed>(true)
        assert.isExactType<boolean | undefined, typeof stillOptional>(true)
    }

    @test(
        'finds nested 1',
        {
            HELLO: 'world',
        },
        ['env.HELLO']
    )
    @test(
        'finds nested 2',
        {
            WHAT: 'the?',
        },
        ['env.WHAT']
    )
    protected static passesWhenFindingNestedItems(
        expected: Record<string, any>,
        keys: string[]
    ) {
        const options = {
            env: expected,
        }

        const actual = assertOptions(options, keys as any)

        assert.isEqualDeep(actual, options)
    }

    @test()
    protected static failsWithDotNotationParams() {
        const err = assert.doesThrow(() =>
            //@ts-ignore
            assertOptions({ nested: { NO_GO: true } }, ['nested.YES_GO'])
        )

        errorAssert.assertError(err, 'MISSING_PARAMETERS', {
            parameters: ['nested.YES_GO'],
        })
    }

    @test()
    protected static typesOnObjectLiteralReferencingOptional() {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { organizationId } = assertOptions(
            { organizationId: this.optionalField },
            ['organizationId']
        )

        assert.isExactType<string, typeof organizationId>(true)
    }
}

class TestClass1<Context extends Record<string, any> = Record<string, any>> {
    public reference?: TestClass2
    public context?: Partial<Context>
}

class TestClass2 {
    public reference?: TestClass1
}
