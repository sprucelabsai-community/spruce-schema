import SpruceError from '../errors/SpruceError'

const assertOptions = function (
	options: Record<string, any>,
	toCheck: string[]
) {
	const missing: string[] = []

	for (const check of toCheck) {
		//@ts-ignore
		if (!options[check]) {
			missing.push(check)
		}
	}

	if (missing.length > 0) {
		throw new SpruceError({
			code: 'MISSING_PARAMETERS',
			parameters: missing,
		})
	}
}

export default assertOptions
