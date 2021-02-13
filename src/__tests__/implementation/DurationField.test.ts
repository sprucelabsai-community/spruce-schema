import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import FieldFactory from '../../factories/FieldFactory'
import { buildDuration, reduceDurationToMs } from '../../fields'
import { DurationFieldValue } from '../../fields/DurationField.types'

export default class DurationFieldTest extends AbstractSpruceTest {
	@test(
		'can get seconds from ms',
		{ ms: 2340 },
		{ ms: 340, seconds: 2, minutes: 0, hours: 0 }
	)
	@test(
		'can get minutes from ms and seconds',
		{ ms: 4500, seconds: 85 },
		{ ms: 500, seconds: 29, minutes: 1, hours: 0 }
	)
	@test(
		'can get minutes and seconds from part of an hour',
		{ hours: 2.52 },
		{ ms: 0, seconds: 12, minutes: 31, hours: 2 }
	)
	protected static testCompletingDurationObject(
		partial: Partial<DurationFieldValue>,
		expected: DurationFieldValue
	) {
		const field = FieldFactory.Field('test', { type: 'duration' })
		const value = field.toValueType(partial)
		assert.isEqualDeep(
			value,
			expected,
			`Duration field did not map ${JSON.stringify(
				partial
			)} to ${JSON.stringify(expected)}`
		)

		// test build directly
		assert.isEqualDeep(
			buildDuration(partial),
			expected,
			`Duration field did not map ${JSON.stringify(
				partial
			)} to ${JSON.stringify(expected)}`
		)
	}

	@test('2000 to seconds', 2000, { seconds: 2 })
	@test('2500 ms to seconds and ms', 2500, { seconds: 2, ms: 500 })
	@test('60 sec to minutes', { seconds: 60 }, { minutes: 1, seconds: 0 })
	protected static canBuildDuration(value: any, expected: any) {
		const results = buildDuration(value)
		assert.doesInclude(results, expected)
	}

	@test('ms to ms', { ms: 1000 }, 1000)
	@test('seconds to ms', { seconds: 1 }, 1000)
	@test('2 seconds to ms', { seconds: 2 }, 2000)
	@test('2.5 seconds to ms', { seconds: 2, ms: 500 }, 2500)
	@test('1 minute to ms', { minutes: 1 }, 1000 * 60)
	@test('1.5 minute to ms', { minutes: 1, seconds: 30 }, 1000 * 90)
	@test('1 hour to ms', { hours: 1 }, 1000 * 60 * 60)
	protected static reduceDurationToMs(value: any, expected: number) {
		const results = reduceDurationToMs(value)
		assert.isEqual(results, expected)
	}
}
