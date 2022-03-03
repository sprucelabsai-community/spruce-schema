import SpruceError from '../errors/SpruceError'

const assertOptions = function <
	Options extends Record<string, any>,
	Keys extends keyof Options = keyof Options
>(
	options: Options,
	toCheck: Keys[],
	friendlyMessage?: string
): Options & Required<Pick<Options, Keys>> {
	const missing: (keyof Options)[] = []

	for (const check of toCheck) {
		const value = options?.[check]

		//@ts-ignore
		if (value === null || typeof value === 'undefined') {
			missing.push(check)
		}
	}

	if (missing.length > 0) {
		throw new SpruceError({
			code: 'MISSING_PARAMETERS',
			parameters: missing as string[],
			friendlyMessage,
		})
	}

	return options as any
}

export default assertOptions
