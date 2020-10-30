/** Make a thing that was an array not an array so isArray can control it */
export type Unpack<A> = A extends Array<infer E> ? E : A

/** Easy array helper */
export type IsArray<T, isArray> = isArray extends true ? Unpack<T>[] : Unpack<T>

/** Array help that does not unpack (you could get array of arrays with this) */
export type IsArrayNoUnpack<T, isArray> = isArray extends true ? T[] : T

/** Easy isRequired helper */
export type IsRequired<T, isRequired> = isRequired extends true
	? T
	: T | undefined | null

export type DeepReadonly<T> = T extends (infer R)[]
	? DeepReadonlyArray<R>
	: // eslint-disable-next-line @typescript-eslint/ban-types
	T extends Function
	? T
	: T extends Record<string, any>
	? DeepReadonlyObject<T>
	: T

export interface DeepReadonlyArray<T> extends ReadonlyArray<DeepReadonly<T>> {}

export type DeepReadonlyObject<T> = {
	readonly [P in keyof T]: DeepReadonly<T[P]>
}
