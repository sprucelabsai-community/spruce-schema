import cloneDeep from './cloneDeep'

export default function cloneDeepPreservingInstances<T>(v: T): T {
	return cloneDeep(v, (value) => {
		const name = value?.__proto__?.constructor?.name
		if (name && name !== 'Object') {
			return value
		}
	})
}
