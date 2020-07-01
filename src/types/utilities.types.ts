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
