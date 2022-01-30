import SpruceError from '../errors/SpruceError'

const assertOptions = function <Options extends Record<string, any>>(
	options: Options,
	toCheck: (keyof Options)[]
): Options {
	const missing: (keyof Options)[] = []

	for (const check of toCheck) {
		//@ts-ignore
		if (typeof options?.[check] === 'undefined') {
			missing.push(check)
		}
	}

	if (missing.length > 0) {
		throw new SpruceError({
			code: 'MISSING_PARAMETERS',
			parameters: missing as string[],
		})
	}

	return options
}

export default assertOptions
