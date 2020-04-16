import { register } from '@sprucelabs/path-resolver'
register()
import BaseTest, { ISpruce, test } from '@sprucelabs/test'
import { ExecutionContext } from 'ava'
import { IDurationFieldValue } from './DurationField'
import { FieldFactory } from '..'
import { FieldType } from '#spruce:schema/fields/fieldType'

/** Context just for this test */
interface IContext {}
export default class DurationFieldTest extends BaseTest {
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
	protected static async testCompletingDurationObject(
		t: ExecutionContext<IContext>,
		spruce: ISpruce,
		partial: Partial<IDurationFieldValue>,
		expected: IDurationFieldValue
	) {
		const field = FieldFactory.field({ type: FieldType.Duration })
		const value = field.toValueType(partial)
		t.deepEqual(
			value,
			expected,
			`Duration field did not map ${JSON.stringify(
				partial
			)} to ${JSON.stringify(expected)}`
		)
	}
}
