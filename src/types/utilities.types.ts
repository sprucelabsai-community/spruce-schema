import { Schema, SchemaRequiredFieldNames } from '../schemas.static.types'

export type Unpack<A> = A extends Array<infer E> ? E : A

export type IsArray<T, isArray> = isArray extends true ? Unpack<T>[] : Unpack<T>

export type IsArrayNoUnpack<T, isArray> = isArray extends true ? T[] : T

export type IsRequired<T, isRequired> = isRequired extends true
	? T
	: T | undefined | null

export type AreAnyFieldsRequired<S extends Schema | undefined> =
	S extends Schema
		? SchemaRequiredFieldNames<S> extends []
			? false
			: true
		: false
