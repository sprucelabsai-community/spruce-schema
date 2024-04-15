import { Schema, SchemaRequiredFieldNames } from '../schemas.static.types'

export type Unpack<A> = A extends (infer E)[] ? E : A

export type IsArray<T, IsArray> = IsArray extends true ? Unpack<T>[] : Unpack<T>

export type IsArrayNoUnpack<T, IsArray> = IsArray extends true ? T[] : T

export type IsRequired<T, IsRequired> = IsRequired extends true
    ? T
    : T | undefined | null

export type AreAnyFieldsRequired<S extends Schema | undefined> =
    S extends Schema
        ? SchemaRequiredFieldNames<S> extends []
            ? false
            : true
        : false
