import get from 'just-safe-get'
import SpruceError from '../errors/SpruceError'

type ForceRequired<
	Options extends Record<string, any>,
	P = Paths<Options>
> = Required<Pick<Options, Extract<P, keyof Options>>>

export default function assertOptions<
	Options extends Record<string, any>,
	Path extends Paths<Options> = Paths<Options>
>(
	options: Options,
	toCheck: Path[],
	friendlyMessage?: string
): Options & Required<Pick<Options, Path>> {
	const missing: Path[] = []

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

type Join<K, P> = K extends string | number
	? P extends string | number
		? `${K}${'' extends P ? '' : '.'}${P}`
		: never
	: never

type Prev = [
	never,
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8,
	9,
	10,
	11,
	12,
	13,
	14,
	15,
	16,
	17,
	18,
	19,
	20,
	...0[]
]

type Paths<T, D extends number = 10> = [D] extends [never]
	? never
	: T extends object
	? {
			[K in keyof T]-?: K extends string | number
				? `${K}` | Join<K, Paths<T[K], Prev[D]>>
				: never
	  }[keyof T]
	: ''
