import SpruceError from '../errors/SpruceError'

const assertOptions = function <Options extends Record<string, any>>(
	options: Options,
	toCheck: string[]
): Options {
	const missing: string[] = []

	for (const check of toCheck) {
		//@ts-ignore
		if (!options?.[check]) {
			missing.push(check)
		}
	}

	if (missing.length > 0) {
		throw new SpruceError({
			code: 'MISSING_PARAMETERS',
			parameters: missing,
		})
	}

	return options
}

export default assertOptions
