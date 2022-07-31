import AbstractSpruceTest, { test, assert } from '@sprucelabs/test'
import { generateId } from '@sprucelabs/test-utils'
import cloneDeep from '../../utilities/cloneDeep'

export default class CloningObjectsTest extends AbstractSpruceTest {
	@test()
	protected static async canCreateCloningObjects() {
		assert.isFunction(cloneDeep)
	}

	@test()
	protected static async canCloneBasicObject() {
		const obj = { hello: 'world' }
		const actual = cloneDeep(obj)
		assert.isEqualDeep(actual, obj)
		assert.isNotEqual(actual, obj)
	}

	@test()
	protected static async canCloneWithOnSimpleObject() {
		const obj = { hello: 'world' }

		let passedValue: any
		let passedKey: any

		cloneDeep(obj, (value, key) => {
			passedValue = value
			passedKey = key
		})

		assert.isEqual(passedValue, 'world')
		assert.isEqual(passedKey, 'hello')
	}

	@test()
	protected static async calledForEachKeyOnObject() {
		const obj = { what: 'the', here: 'there' }

		const passedValues: any[] = []
		const passedKeys: any[] = []

		cloneDeep(obj, (value, key) => {
			passedValues.push(value)
			passedKeys.push(key)
		})

		assert.isEqualDeep(passedValues, ['the', 'there'])
		assert.isEqualDeep(passedKeys, ['what', 'here'])
	}

	@test('can transform keys 1', 'go')
	@test('can transform keys 2', 'team')
	protected static async canTarnsformCopyingOfKeys(k: string) {
		const obj = { go: 'to', team: 'stop' }
		const newValue = generateId()

		const actual = cloneDeep(obj, (_, key) => {
			if (key === k) {
				return newValue
			}
			return
		})

		const expected = {
			...obj,
			[k]: newValue,
		}

		assert.isEqualDeep(actual, expected)
	}

	@test()
	protected static async canTransformBasedOnKeysPassedInArray() {
		const obj = [
			{ go: 'to', team: 'stop' },
			{ go: 'another', team: 'go' },
		]

		const newValue = generateId()

		const actual = cloneDeep(obj, (_, key) => {
			if (key === 'go') {
				return newValue
			}
			return
		})

		assert.isEqualDeep(actual, [
			{ team: 'stop', go: newValue },
			{ team: 'go', go: newValue },
		])
	}

	@test()
	protected static async canIgnoreKeysPassedInSet() {
		const obj = new Set([
			{ hey: 'to', team: 'stop' },
			{ hey: 'another', team: 'hey' },
		])

		const newValue = generateId()

		const actual = cloneDeep(obj, (_, key) => {
			if (key === 'team') {
				return newValue
			}

			return
		})

		//@ts-ignore
		assert.isEqualDeep(
			[...actual],
			[
				{ hey: 'to', team: newValue },
				{ hey: 'another', team: newValue },
			]
		)
	}

	@test()
	protected static async canIgnoreKeysPassedInMap() {
		const obj = new Map()
		obj.set('run', 'stop')
		obj.set('walk', 'go')
		obj.set('still', false)

		const actual = cloneDeep(obj, (_, key) => {
			return key !== 'walk'
		})

		assert.isEqualDeep([...actual.values()], ['stop', false])
	}
}
