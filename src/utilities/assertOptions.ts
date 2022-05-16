import get from 'just-safe-get'
import SpruceError from '../errors/SpruceError'

export default function assertOptions<
	Options extends Record<string, any>,
	Key extends Join<PathsToStringProps<Options>, '.'> = Join<
		PathsToStringProps<Options>,
		'.'
	>
>(
	options: Options,
	toCheck: Key[],
	friendlyMessage?: string
): Options & Required<Pick<Options, Key>> {
	const missing: (keyof Options)[] = []

	for (const check of toCheck) {
		const value = get(options ?? {}, check as string)

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

export type PathsToStringProps<T> = T extends Record<string, any>
	? {
			[K in keyof T]: [K, ...PathsToStringProps<T[K]>]
	  }[keyof T]
	: []

type Join<T extends string[], D extends string> = T extends []
	? never
	: T extends [infer F]
	? F
	: T extends [infer F, ...infer R]
	? F extends string
		? `${F}${D}${Join<Extract<R, string[]>, D>}`
		: never
	: string
