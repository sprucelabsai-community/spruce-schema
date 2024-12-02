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

export type ValuesWithPaths<
    Values,
    Keys extends PathsWithDotNotation<Values> = PathsWithDotNotation<Values>,
> = {
    [K in RequiredKeys<Values, Keys>]: TypeAtPath<Values, K>
} & {
    [K in OptionalKeys<Values, Keys>]?: TypeAtPath<Values, K>
}

type IsOptional<T, K extends keyof T> = T extends any
    ? {} extends Pick<T, K>
        ? true
        : false
    : never

type IsPathOptional<T, P extends string> = T extends any
    ? P extends `${infer K}.${infer Rest}`
        ? K extends keyof T
            ? IsOptional<T, K> extends true
                ? true
                : IsPathOptional<T[K], Rest>
            : true
        : P extends keyof T
          ? IsOptional<T, P>
          : true
    : true

type RequiredKeys<Values, Keys extends PathsWithDotNotation<Values>> = {
    [K in Keys]: IsPathOptional<Values, K> extends true ? never : K
}[Keys]

type OptionalKeys<Values, Keys extends PathsWithDotNotation<Values>> = Exclude<
    Keys,
    RequiredKeys<Values, Keys>
>

export type PathsWithDotNotation<T, D extends number = 3> = [D] extends [never]
    ? never
    : T extends object
      ? {
            [K in keyof T]-?: K extends string | number
                ? `${K}` | Join<K, PathsWithDotNotation<T[K], Prev[D]>>
                : never
        }[keyof T]
      : ''

export type TypeAtPath<T, P extends string> = T extends any
    ? T extends null | undefined
        ? undefined
        : P extends `${infer K}.${infer Rest}`
          ? K extends keyof T
              ? TypeAtPath<T[K], Rest>
              : any
          : P extends keyof T
            ? T[P]
            : any
    : never

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
    ...0[],
]
