export default class KeyMapper {
	private map: Record<string, any>
	public constructor(map: Record<string, any>) {
		this.map = map
	}

	public mapTo(values: Record<string, any>) {
		return keyMapper.mapTo(values, this.map)
	}

	public mapFrom(values: Record<string, any>) {
		return keyMapper.mapFrom(values, this.map)
	}

	public mapFieldNameTo(name: string) {
		return this.map[name]
	}

	public mapFieldNameFrom(name: string) {
		for (const key in this.map) {
			// eslint-disable-next-line no-prototype-builtins
			if (this.map.hasOwnProperty(key)) {
				if (this.map[key] === name) {
					return key
				}
			}
		}
		return null
	}
}

const keyMapper = {
	mapTo(values: Record<string, any>, map: Record<string, any>) {
		let target: any = {}
		for (const key in map) {
			// eslint-disable-next-line no-prototype-builtins
			if (values.hasOwnProperty(key)) {
				target[map[key]] = values[key]
			}
		}
		return target
	},

	mapFrom(values: Record<string, any>, map: Record<string, any>) {
		let target: any = {}
		for (const targetKey in map) {
			const sourceKey = map[targetKey]
			// eslint-disable-next-line no-prototype-builtins
			if (values.hasOwnProperty(sourceKey)) {
				target[targetKey] = values[sourceKey]
			}
		}
		return target
	},
}
